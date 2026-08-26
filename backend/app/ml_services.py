"""
ML Services:
  1. IsolationForestDetector  — real-time anomaly detection on scrap events
  2. ILPBatchOptimiser        — PuLP Integer-Linear-Programme for batch feasibility
  3. SpecialMenuGenerator     — scores & ranks recipes for Daily Special generation
"""

from __future__ import annotations

import json
import logging
import math
import random
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

import numpy as np
from sklearn.ensemble import IsolationForest

logger = logging.getLogger(__name__)


# ─────────────────────────── Isolation Forest ────────────────────────────────

@dataclass
class ScrapFeatureVector:
    quantity_scrapped_g: float
    yield_loss_pct: float
    knife_efficiency_score: float

    def to_array(self) -> list[float]:
        return [self.quantity_scrapped_g, self.yield_loss_pct, self.knife_efficiency_score]


class IsolationForestDetector:
    """
    Maintains one IsolationForest model per kitchen station.
    Retrains incrementally when ≥ MIN_SAMPLES are available.
    """

    MIN_SAMPLES: int = 10
    CONTAMINATION: float = 0.1

    def __init__(self) -> None:
        self._models: dict[str, IsolationForest] = {}
        self._history: dict[str, list[list[float]]] = {}

    def _get_or_init(self, station: str) -> tuple[IsolationForest | None, list[list[float]]]:
        history = self._history.setdefault(station, [])
        model   = self._models.get(station)
        return model, history

    def _retrain(self, station: str, history: list[list[float]]) -> IsolationForest:
        X = np.array(history)
        clf = IsolationForest(
            contamination=self.CONTAMINATION,
            random_state=42,
            n_estimators=100,
        )
        clf.fit(X)
        self._models[station] = clf
        logger.info("IsolationForest retrained for station=%s on %d samples", station, len(history))
        return clf

    def score(self, station: str, vec: ScrapFeatureVector) -> tuple[bool, float]:
        """
        Returns (is_anomaly, anomaly_score ∈ [0,1]).
        score close to 1 → strongly anomalous.
        """
        model, history = self._get_or_init(station)
        arr = vec.to_array()
        history.append(arr)

        if len(history) < self.MIN_SAMPLES:
            # Not enough data — use heuristic thresholds
            is_anomaly = (
                vec.yield_loss_pct > 60.0
                or vec.knife_efficiency_score < 30.0
                or vec.quantity_scrapped_g > 2000.0
            )
            score = 0.85 if is_anomaly else 0.1
            return is_anomaly, score

        model = self._retrain(station, history)
        X = np.array([arr])
        raw_score = model.decision_function(X)[0]   # negative is more anomalous
        pred      = model.predict(X)[0]             # -1 = anomaly, 1 = normal

        # Normalise to [0, 1]: lower raw_score → higher anomaly score
        normalised = float(np.clip(1.0 - (raw_score + 0.5), 0.0, 1.0))
        is_anomaly = pred == -1
        return is_anomaly, round(normalised, 4)


# Singleton
anomaly_detector = IsolationForestDetector()


# ─────────────────────────── ILP Batch Optimiser ─────────────────────────────

@dataclass
class RecipeIngredientSpec:
    ingredient_id: int
    name: str
    quantity_g_per_portion: float
    available_stock_g: float


@dataclass
class BatchResult:
    feasible_portions: int
    limiting_ingredient: str | None
    score: float  # 0–100 feasibility score


def ilp_batch_feasibility(
    desired_portions: int,
    ingredients: list[RecipeIngredientSpec],
) -> BatchResult:
    """
    Solve: maximise portions produced s.t. ingredient constraints.
    Uses PuLP with CBC solver (bundled).
    Falls back to a pure-Python greedy solver if PuLP is unavailable.
    """
    try:
        import pulp  # type: ignore

        prob = pulp.LpProblem("BatchFeasibility", pulp.LpMaximize)
        portions_var = pulp.LpVariable("portions", lowBound=0, upBound=desired_portions, cat="Integer")
        prob += portions_var  # objective: maximise portions

        for ing in ingredients:
            if ing.quantity_g_per_portion > 0:
                max_from_ing = ing.available_stock_g / ing.quantity_g_per_portion
                prob += portions_var <= max_from_ing

        solver = pulp.PULP_CBC_CMD(msg=False)
        prob.solve(solver)

        feasible = int(pulp.value(portions_var) or 0)
        feasible = max(0, min(feasible, desired_portions))

        # Identify limiting ingredient
        limiting: str | None = None
        min_max = float("inf")
        for ing in ingredients:
            if ing.quantity_g_per_portion > 0:
                cap = ing.available_stock_g / ing.quantity_g_per_portion
                if cap < min_max:
                    min_max = cap
                    limiting = ing.name

        score = round((feasible / desired_portions) * 100.0, 2) if desired_portions else 0.0
        return BatchResult(feasible_portions=feasible, limiting_ingredient=limiting, score=score)

    except Exception as exc:
        logger.warning("PuLP solver failed (%s) — falling back to greedy", exc)
        return _greedy_batch(desired_portions, ingredients)


def _greedy_batch(
    desired_portions: int,
    ingredients: list[RecipeIngredientSpec],
) -> BatchResult:
    """Pure-Python fallback for batch feasibility."""
    feasible = desired_portions
    limiting: str | None = None

    for ing in ingredients:
        if ing.quantity_g_per_portion <= 0:
            continue
        cap = int(ing.available_stock_g / ing.quantity_g_per_portion)
        if cap < feasible:
            feasible  = cap
            limiting  = ing.name

    score = round((feasible / desired_portions) * 100.0, 2) if desired_portions else 0.0
    return BatchResult(feasible_portions=feasible, limiting_ingredient=limiting, score=score)


# ─────────────────────────── Special Menu Generator ──────────────────────────

@dataclass
class RecipeScore:
    recipe_id: int
    name: str
    scrap_utilisation_pct: float
    ilp_batch_score: float
    final_price: float
    discount_pct: float
    max_portions: int


def score_recipes_for_specials(
    recipes: list[dict[str, Any]],
    scrap_map: dict[int, float],      # ingredient_id → scrapped_g available
    stock_map: dict[int, float],      # ingredient_id → current_stock_g
    max_specials: int = 5,
    discount_pct: float = 20.0,
    min_scrap_utilisation: float = 10.0,
) -> list[RecipeScore]:
    """
    Rank recipes by how much kitchen scrap they consume.
    Returns up to `max_specials` RecipeScore objects.
    """
    scored: list[RecipeScore] = []

    for r in recipes:
        ingredients_used = r.get("ingredients", [])
        if not ingredients_used:
            continue

        total_needed_g    = 0.0
        total_from_scrap  = 0.0

        for ri in ingredients_used:
            iid = ri["ingredient_id"]
            qty = ri["quantity_g"]
            total_needed_g   += qty
            total_from_scrap += min(qty, scrap_map.get(iid, 0.0))

        if total_needed_g == 0:
            continue

        scrap_util = (total_from_scrap / total_needed_g) * 100.0
        if scrap_util < min_scrap_utilisation:
            continue

        # ILP feasibility
        specs = [
            RecipeIngredientSpec(
                ingredient_id=ri["ingredient_id"],
                name=ri.get("name", str(ri["ingredient_id"])),
                quantity_g_per_portion=ri["quantity_g"],
                available_stock_g=stock_map.get(ri["ingredient_id"], 0.0),
            )
            for ri in ingredients_used
        ]
        ilp_result = ilp_batch_feasibility(desired_portions=20, ingredients=specs)

        base_price  = float(r.get("base_price", 0.0))
        final_price = round(base_price * (1.0 - discount_pct / 100.0), 2)

        scored.append(
            RecipeScore(
                recipe_id=r["id"],
                name=r["name"],
                scrap_utilisation_pct=round(scrap_util, 2),
                ilp_batch_score=ilp_result.score,
                final_price=max(final_price, 0.01),
                discount_pct=discount_pct,
                max_portions=ilp_result.feasible_portions,
            )
        )

    # Sort by composite score (60% scrap utilisation + 40% ILP score)
    scored.sort(
        key=lambda s: (0.6 * s.scrap_utilisation_pct + 0.4 * s.ilp_batch_score),
        reverse=True,
    )
    return scored[:max_specials]
