import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { mockRecipes } from "./data/mockRecipes";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("MealMatch API is running");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "MealMatch API" });
});

type PantryItem = {
  name: string;
  quantity: number;
  unit: string;
};

type RecipeIngredient = {
  name: string;
  quantity?: number;
  unit?: string;
};

function computeMatch(
  pantry: PantryItem[],
  recipeIngredients: RecipeIngredient[],
) {
  const normalizedPantry = pantry.map((item) => ({
    name: item.name.trim().toLowerCase(),
    quantity: Number(item.quantity),
    unit: item.unit.trim().toLowerCase(),
  }));

  const have: string[] = [];
  const missing: string[] = [];

  for (const ingredient of recipeIngredients) {
    const recipeName = ingredient.name.trim().toLowerCase();
    const recipeQuantity = ingredient.quantity;
    const recipeUnit = ingredient.unit?.trim().toLowerCase();

    const pantryItem = normalizedPantry.find(
      (item) => item.name === recipeName,
    );

    if (!pantryItem) {
      missing.push(recipeName);
      continue;
    }

    if (
      recipeQuantity != null &&
      recipeUnit &&
      pantryItem.unit === recipeUnit &&
      pantryItem.quantity >= recipeQuantity
    ) {
      have.push(recipeName);
      continue;
    }

    if (recipeQuantity == null || !recipeUnit) {
      have.push(recipeName);
      continue;
    }

    missing.push(recipeName);
  }

  const total = recipeIngredients.length || 1;
  const match = have.length / total;

  return { match, have, missing };
}

app.post("/api/recipes/suggest", async (req, res) => {
  const { pantry } = req.body as { pantry?: PantryItem[] };

  if (!Array.isArray(pantry)) {
    return res.status(400).json({
      error: "pantry must be an array of pantry items",
    });
  }

  const query = pantry
    .map((item) => String(item.name).trim())
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");

  try {
    const rawRecipes = mockRecipes;
    const recipes = rawRecipes.map((r: any) => {
      const recipeIngredients: RecipeIngredient[] = Array.isArray(r.ingredients)
        ? r.ingredients
        : [];

      const { match, have, missing } = computeMatch(pantry, recipeIngredients);

      const status =
        missing.length === 0
          ? "can-make-now"
          : missing.length <= 2
            ? "missing-few"
            : "missing-many";

      return {
        ...r,
        match,
        have,
        missing,
        status,
      };
    });

    recipes.sort((a: any, b: any) => (b.match ?? 0) - (a.match ?? 0));

    return res.json({ query, recipes });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
  console.log(`MealMatch API running on http://localhost:${PORT}`);
});
