import { useMemo } from "react";
import { RecipeColumn } from "../features/recipes/components/RecipeColumn";
import { recipesBoard } from "../features/recipes/data/mockRecipesBoard";
import type { DietTag, Recipe } from "../features/recipes/types/recipe.types";

const columns: DietTag[] = [
  "Vegetarian",
  "Gluten Free",
  "High Fiber",
  "High Protein",
  "Low Carb",
];

type RecipesPageProps = {
  onOpenRecipe: (recipe: Recipe) => void;
};

export function RecipesPage({ onOpenRecipe }: RecipesPageProps) {
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
          <RecipeColumn
            key={tag}
            title={tag}
            recipes={byTag.get(tag) ?? []}
            onOpenRecipe={onOpenRecipe}
          />
        ))}
      </section>
    </div>
  );
}
