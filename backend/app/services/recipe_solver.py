"""
KitchenOS Integer Linear Programming (ILP) Reverse Recipe Solver
=================================================================
Formulates and solves integer linear programming models using PuLP to maximize
gross revenue from available kitchen scrap reservoirs while enforcing minimum
batch sizes and gross margin constraints.
"""

from __future__ import annotations

import logging
from typing import Dict, List, Optional
import pulp
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import ByproductRecipe, ScrapCategory, ScrapLedger, ScrapStatus
from app.schemas import FeasibleRecipeCard

logger = logging.getLogger("kitchenos.solver")


class RecipeILPSolver:
    """
    Integer Linear Programming optimizer for byproduct recipe matching.
    """

    MIN_BATCH_PORTIONS: int = 8
    MIN_GROSS_MARGIN_PCT: float = 85.0

    def get_available_scrap_by_category(self, db: Session) -> Dict[ScrapCategory, float]:
        """Queries the active reservoir and aggregates available scrap mass per category."""
        rows = (
            db.query(
                ScrapLedger.scrap_category,
                func.sum(ScrapLedger.scrap_weight_kg).label("total_weight"),
            )
            .filter(ScrapLedger.status == ScrapStatus.AVAILABLE)
            .group_by(ScrapLedger.scrap_category)
            .all()
        )
        totals = {cat: 0.0 for cat in ScrapCategory}
        for cat, total in rows:
            totals[cat] = float(total or 0.0)
        return totals

    def calculate_recipe_financials(
        self,
        recipe: ByproductRecipe,
        portions: int,
    ) -> Dict[str, float]:
        """Calculates financial metrics (revenue, pantry cost, gross profit, gross margin %)."""
        revenue = round(portions * recipe.suggested_price, 2)
        pantry_cost = round(portions * recipe.pantry_cost_per_portion, 2)
        gross_profit = round(revenue - pantry_cost, 2)
        gross_margin_pct = round((gross_profit / revenue * 100.0) if revenue > 0 else 0.0, 2)

        return {
            "revenue": revenue,
            "pantry_cost": pantry_cost,
            "gross_profit": gross_profit,
            "gross_margin_pct": gross_margin_pct,
        }

    def solve_multi_recipe_optimization(
        self,
        db: Session,
    ) -> List[FeasibleRecipeCard]:
        """
        Formulates and executes a global Integer Linear Program (ILP) using PuLP:
            Maximize: Sum( suggested_price[i] * x[i] )
            Subject to:
                Sum_{i in Cat}( scrap_per_portion[i] * x[i] ) <= Available_Scrap[Cat]
                x[i] >= 8 * y[i]   (Minimum batch constraint)
                x[i] <= M * y[i]   (Big-M upper bound indicator)
                y[i] in {0, 1}     (Binary production activation variable)
                x[i] in Integers >= 0
                Gross_Margin_Pct[i] >= 85%
        """
        available_scrap = self.get_available_scrap_by_category(db)
        recipes = db.query(ByproductRecipe).all()

        if not recipes:
            return []

        # Filter out recipes that statically fail the 85% gross margin threshold
        eligible_recipes = []
        for r in recipes:
            if r.suggested_price <= 0:
                continue
            unit_margin = (r.suggested_price - r.pantry_cost_per_portion) / r.suggested_price * 100.0
            if unit_margin >= self.MIN_GROSS_MARGIN_PCT:
                eligible_recipes.append(r)

        if not eligible_recipes:
            return []

        # Create PuLP Optimization Problem
        prob = pulp.LpProblem("KitchenOS_Scrap_To_Menu_ILP", pulp.LpMaximize)

        # Decision Variables
        portion_vars: Dict[int, pulp.LpVariable] = {}
        indicator_vars: Dict[int, pulp.LpVariable] = {}

        BIG_M = 1000  # Conservative upper bound on single recipe batch size

        for r in eligible_recipes:
            # Integer portions produced
            portion_vars[r.id] = pulp.LpVariable(
                f"portions_{r.id}",
                lowBound=0,
                upBound=BIG_M,
                cat=pulp.LpInteger,
            )
            # Binary indicator: 1 if recipe r is produced, 0 otherwise
            indicator_vars[r.id] = pulp.LpVariable(
                f"produce_{r.id}",
                cat=pulp.LpBinary,
            )

            # Minimum batch constraint: If produced, portions >= 8
            prob += (
                portion_vars[r.id] >= self.MIN_BATCH_PORTIONS * indicator_vars[r.id],
                f"MinBatch_{r.id}",
            )
            # Upper bound linking
            prob += (
                portion_vars[r.id] <= BIG_M * indicator_vars[r.id],
                f"MaxLink_{r.id}",
            )

        # Objective Function: Maximize Gross Revenue
        prob += (
            pulp.lpSum(
                [portion_vars[r.id] * r.suggested_price for r in eligible_recipes]
            ),
            "Total_Gross_Revenue",
        )

        # Scrap Availability Constraints per Category
        for cat in ScrapCategory:
            cat_recipes = [r for r in eligible_recipes if r.primary_scrap_category == cat]
            if cat_recipes:
                prob += (
                    pulp.lpSum(
                        [portion_vars[r.id] * r.scrap_per_portion_kg for r in cat_recipes]
                    )
                    <= available_scrap.get(cat, 0.0),
                    f"ScrapLimit_{cat.value}",
                )

        # Solve ILP model
        solver = pulp.PULP_CBC_CMD(msg=False)
        status = prob.solve(solver)
        logger.info("PuLP solver completed with status: %s", pulp.LpStatus[status])

        results: List[FeasibleRecipeCard] = []

        # Collect ILP optimal solution cards
        for r in eligible_recipes:
            val = portion_vars[r.id].varValue
            portions = int(round(val)) if val is not None else 0

            # If the global ILP produced 0 because another recipe in the same category was preferred,
            # we also calculate individual standalone feasibility for this recipe so the kitchen team
            # has full visibility of all possible options.
            if portions < self.MIN_BATCH_PORTIONS:
                cat_scrap = available_scrap.get(r.primary_scrap_category, 0.0)
                standalone_portions = int(cat_scrap // r.scrap_per_portion_kg)
                if standalone_portions >= self.MIN_BATCH_PORTIONS:
                    portions = standalone_portions
                else:
                    continue

            fin = self.calculate_recipe_financials(r, portions)

            if fin["gross_margin_pct"] >= self.MIN_GROSS_MARGIN_PCT:
                results.append(
                    FeasibleRecipeCard(
                        recipe_id=r.id,
                        name=r.name,
                        primary_scrap_category=r.primary_scrap_category,
                        scrap_per_portion_kg=r.scrap_per_portion_kg,
                        suggested_price=r.suggested_price,
                        pantry_cost_per_portion=r.pantry_cost_per_portion,
                        available_scrap_kg=round(available_scrap.get(r.primary_scrap_category, 0.0), 3),
                        calculated_portions=portions,
                        expected_revenue=fin["revenue"],
                        expected_pantry_cost=fin["pantry_cost"],
                        expected_gross_profit=fin["gross_profit"],
                        gross_margin_percentage=fin["gross_margin_pct"],
                        description=r.description,
                    )
                )

        # Sort by expected gross profit descending
        results.sort(key=lambda c: c.expected_gross_profit, reverse=True)
        return results


recipe_solver = RecipeILPSolver()
