import { useMemo } from "react";
import { recipesBoard } from "../features/recipes/mockRecipesBoard";
import { RecipeColumn } from "../features/recipes/RecipeColumn";
import type { DietTag } from "../features/recipes/recipes.types";

const columns: DietTag[] = [
  "Vegetarian",
  "Gluten Free",
  "High Fiber",
  "High Protein",
  "Low Carb",
];

export function RecipesPage() {
  const byTag = useMemo(() => {
    const map = new Map<DietTag, typeof recipesBoard>();
    for (const tag of columns) map.set(tag, []);
    for (const r of recipesBoard) {
      for (const tag of r.tags) {
        if (map.has(tag)) map.get(tag)!.push(r);
      }
    }
    return map;
  }, []);

  return (
    <div className="page">
      <section className="card">
        <h2>Recipes</h2>
        <p className="muted">Browse by category and filters.</p>
      </section>

      <section className="recipes-board">
        {columns.map((tag) => (
          <RecipeColumn key={tag} title={tag} recipes={byTag.get(tag) ?? []} />
        ))}
      </section>
    </div>
  );
}
