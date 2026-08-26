"""
KitchenOS Machine Learning Anomaly Detection Service
====================================================
Uses scikit-learn's Isolation Forest algorithm to detect yield anomalies and
knife inefficiency during kitchen prep-scrap logging.

Includes a deterministic baseline deviation fallback when historical sample size
is insufficient (< 10 observations).
"""

from __future__ import annotations

import logging
from typing import List, Tuple
import numpy as np
from sklearn.ensemble import IsolationForest
from sqlalchemy.orm import Session

from app.models import RawInventory, ScrapLedger

logger = logging.getLogger("kitchenos.ml")


class ScrapAnomalyDetector:
    """
    Anomaly detection engine for kitchen prep-scrap logging.
    Evaluates:
      1. Calculated trim ratio vs baseline expectation.
      2. Absolute trim deviation from ingredient standard.
      3. Total batch mass and scrap ratio distribution.
    """

    MIN_SAMPLES_FOR_ISOLATION_FOREST: int = 10
    CONTAMINATION_RATE: float = 0.10  # Expect ~10% outliers under normal operations

    def _extract_features(
        self,
        trim_ratio: float,
        baseline_trim_ratio: float,
        usable_weight_kg: float,
        scrap_weight_kg: float,
    ) -> List[float]:
        """
        Feature vector representation:
        [trim_ratio, baseline_trim_ratio, delta_from_baseline, usable_weight_kg, scrap_weight_kg]
        """
        delta = trim_ratio - baseline_trim_ratio
        return [
            float(trim_ratio),
            float(baseline_trim_ratio),
            float(delta),
            float(usable_weight_kg),
            float(scrap_weight_kg),
        ]

    def _deterministic_fallback(
        self,
        trim_ratio: float,
        baseline_trim_ratio: float,
    ) -> Tuple[bool, float]:
        """
        Fallback when historical samples are insufficient.
        Flags anomalous trim if trim_ratio deviates by > 40% above baseline.
        """
        if baseline_trim_ratio <= 0.0:
            baseline_trim_ratio = 0.15

        relative_deviation = (trim_ratio - baseline_trim_ratio) / baseline_trim_ratio
        anomaly_score = max(0.0, float(relative_deviation))

        # Flag as anomaly if scrap percentage exceeds 140% of baseline expectation
        is_anomaly = relative_deviation > 0.40
        return is_anomaly, round(anomaly_score, 4)

    def detect_anomaly(
        self,
        db: Session,
        raw_inventory: RawInventory,
        usable_weight_kg: float,
        scrap_weight_kg: float,
        trim_ratio: float,
    ) -> Tuple[bool, float]:
        """
        Evaluates whether a prep scrap entry is an operational anomaly.
        Returns:
            (is_anomaly: bool, anomaly_score: float)
        """
        # Fetch historical scrap entries for this raw ingredient
        historical_logs = (
            db.query(ScrapLedger)
            .filter(ScrapLedger.raw_inventory_id == raw_inventory.id)
            .all()
        )

        current_features = self._extract_features(
            trim_ratio=trim_ratio,
            baseline_trim_ratio=raw_inventory.baseline_trim_ratio,
            usable_weight_kg=usable_weight_kg,
            scrap_weight_kg=scrap_weight_kg,
        )

        if len(historical_logs) < self.MIN_SAMPLES_FOR_ISOLATION_FOREST:
            logger.info(
                "Insufficient historical data (%d < %d) for ingredient %s. Using baseline fallback.",
                len(historical_logs),
                self.MIN_SAMPLES_FOR_ISOLATION_FOREST,
                raw_inventory.name,
            )
            return self._deterministic_fallback(
                trim_ratio=trim_ratio,
                baseline_trim_ratio=raw_inventory.baseline_trim_ratio,
            )

        try:
            # Build training matrix from historical observations
            X_train = []
            for log in historical_logs:
                features = self._extract_features(
                    trim_ratio=log.trim_ratio,
                    baseline_trim_ratio=raw_inventory.baseline_trim_ratio,
                    usable_weight_kg=log.usable_weight_kg,
                    scrap_weight_kg=log.scrap_weight_kg,
                )
                X_train.append(features)

            X_train = np.array(X_train, dtype=np.float64)
            X_curr = np.array([current_features], dtype=np.float64)

            # Fit Isolation Forest
            model = IsolationForest(
                n_estimators=50,
                contamination=self.CONTAMINATION_RATE,
                random_state=42,
            )
            model.fit(X_train)

            # Prediction: 1 = inlier, -1 = outlier (anomaly)
            prediction = model.predict(X_curr)[0]
            # score_samples returns negative anomaly score (lower means more anomalous)
            raw_score = model.score_samples(X_curr)[0]
            anomaly_score = round(float(-raw_score), 4)

            # An entry is anomalous if the model flags outlier AND trim exceeds baseline
            is_anomaly = bool(prediction == -1 and trim_ratio > raw_inventory.baseline_trim_ratio)

            return is_anomaly, anomaly_score

        except Exception as exc:
            logger.warning(
                "Isolation Forest execution encountered an error: %s. Falling back to deterministic rule.",
                str(exc),
            )
            return self._deterministic_fallback(
                trim_ratio=trim_ratio,
                baseline_trim_ratio=raw_inventory.baseline_trim_ratio,
            )


anomaly_detector = ScrapAnomalyDetector()
