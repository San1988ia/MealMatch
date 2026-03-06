import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { edamamSearch } from "./services/edamam";
import { mealdbSearch } from "./services/mealdb";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Root (optional)
app.get("/", (_req, res) => {
  res.send("MealMatch API is running");
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "MealMatch API" });
});

function computeMatch(pantry: string[], recipeIngredients: string[]) {
  const pantrySet = new Set(
    pantry.map((x) => x.trim().toLowerCase()).filter(Boolean),
  );

  const recipeSet = new Set(
    recipeIngredients.map((x) => x.trim().toLowerCase()).filter(Boolean),
  );

  const have: string[] = [];
  const missing: string[] = [];

  for (const ing of recipeSet) {
    if (pantrySet.has(ing)) have.push(ing);
    else missing.push(ing);
  }

  const total = recipeSet.size || 1;
  const match = have.length / total;

  return { match, have, missing };
}

app.post("/api/recipes/suggest", async (req, res) => {
  const { ingredients } = req.body as { ingredients?: string[] };

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({
      error: "ingredients must be an array of strings",
    });
  }

  const query = ingredients
    .map((x) => String(x).trim())
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");

  try {
    // Try Edamam, but DON'T fail the request if Edamam rejects keys
    let edamamResults: any[] = [];
    try {
      edamamResults = await edamamSearch(query);
    } catch (e) {
      console.warn("Edamam failed, falling back to MealDB:", e);
    }

    const rawRecipes =
      edamamResults.length > 0 ? edamamResults : await mealdbSearch(query);

    // Add match data (only meaningful if recipe has ingredients array)
    const recipes = rawRecipes.map((r: any) => {
      const recipeIngredients: string[] = Array.isArray(r.ingredients)
        ? r.ingredients
        : [];

      const { match, have, missing } = computeMatch(
        ingredients,
        recipeIngredients,
      );

      return {
        ...r,
        match,
        have,
        missing,
      };
    });

    // Bonus: sort best match first
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

// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import { edamamSearch } from "./services/edamam";
// import { mealdbSearch } from "./services/mealdb";

// dotenv.config();

// const app = express();

// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(express.json());

// // TEST endpoint
// app.get("/health", (_req, res) => {
//   res.json({ ok: true, app: "MealMatch API" });
// });

// // MAIN endpoint
// app.post("/api/recipes/suggest", (req, res) => {
//   const { ingredients } = req.body as { ingredients?: string[] };

//   if (!Array.isArray(ingredients)) {
//     return res.status(400).json({
//       error: "ingredients must be an array",
//     });
//   }

//   // Mock response (we replace this later with real API)
//   const recipes = [
//     { id: "pancakes", title: "Pancakes", match: 0.9 },
//     { id: "omelette", title: "Omelette", match: 0.7 },
//   ];

//   res.json({
//     recipes,
//     receivedIngredients: ingredients,
//   });
// });

// const PORT = Number(process.env.PORT ?? 4000);

// app.listen(PORT, () => {
//   console.log(`MealMatch API running on http://localhost:${PORT}`);
// });
