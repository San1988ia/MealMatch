import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

import { mockRecipes } from "./data/mockRecipes";
import { edamamSearch } from "./services/edamam";
import { mealdbSearch } from "./services/mealdb";
import type { MealMatchRecipe } from "./types/recipe";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("MealMatch API is running");
});

app.get("/health", (_req: Request, res: Response) => {
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

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

function isIngredientMatch(pantryName: string, recipeName: string): boolean {
  const p = normalizeName(pantryName);
  const r = normalizeName(recipeName);

  if (!p || !r) return false;
  if (p === r) return true;

  const pSingular = p.endsWith("s") ? p.slice(0, -1) : p;
  const rSingular = r.endsWith("s") ? r.slice(0, -1) : r;
  if (pSingular === rSingular) return true;

  return r.includes(pSingular) || p.includes(rSingular);
}

function dedupeByIdAndTitle<T extends { id: string; title: string }>(
  recipes: T[],
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const recipe of recipes) {
    const key = `${recipe.id}|${recipe.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(recipe);
  }

  return out;
}

app.post("/api/recipes/suggest", async (req: Request, res: Response) => {
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

  const ingredientQueries = pantry
    .map((item) => normalizeName(item.name))
    .filter(Boolean)
    .slice(0, 4);

  try {
    const mealdbTasks = ingredientQueries.map((name) => mealdbSearch(name));
    const [mealdbSettled, edamamSettled] = await Promise.all([
      Promise.allSettled(mealdbTasks),
      edamamSearch(query),
    ]);

    const mealdbRecipes = mealdbSettled
      .filter(
        (
          r,
        ): r is PromiseFulfilledResult<MealMatchRecipe[]> => r.status === "fulfilled",
      )
      .flatMap((r) => r.value);

    const rawRecipes = dedupeByIdAndTitle([
      ...mealdbRecipes,
      ...edamamSettled,
    ]);

    const scored = rawRecipes.map((r: any) => {
      const recipeIngredients: RecipeIngredient[] = Array.isArray(r.ingredients)
        ? r.ingredients
        : [];

      const adjustedIngredients = recipeIngredients.map((ing) => {
        const matchingPantryItem = pantry.find((item) =>
          isIngredientMatch(item.name, ing.name),
        );

        return matchingPantryItem
          ? { ...ing, name: normalizeName(matchingPantryItem.name) }
          : ing;
      });

      const normalizedPantry = pantry.map((item) => ({
        ...item,
        name: normalizeName(item.name),
      }));

      const { match, have, missing } = computeMatch(
        normalizedPantry,
        adjustedIngredients,
      );

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

    const recipes = scored
      .filter((r: any) => (r.have?.length ?? 0) > 0)
      .sort((a: any, b: any) => (b.match ?? 0) - (a.match ?? 0));

    if (recipes.length > 0) {
      return res.json({ query, recipes });
    }

    const fallbackRecipes = mockRecipes
      .map((r: any) => {
        const { match, have, missing } = computeMatch(pantry, r.ingredients ?? []);
        const status =
          missing.length === 0
            ? "can-make-now"
            : missing.length <= 2
              ? "missing-few"
              : "missing-many";
        return { ...r, match, have, missing, status };
      })
      .sort((a: any, b: any) => (b.match ?? 0) - (a.match ?? 0));

    return res.json({ query, recipes: fallbackRecipes });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
  console.log(`MealMatch API running on http://localhost:${PORT}`);
});
