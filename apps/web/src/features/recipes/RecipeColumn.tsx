import { RecipeCard } from "./RecipeCard";
import type { Recipe } from "./recipes.types";

type RecipeColumnProps = {
  title: string;
  recipes: Recipe[];
};

export function RecipeColumn({ title, recipes }: RecipeColumnProps) {
  return (
    <section className="recipes-column">
      <h3 className="recipes-column__title">{title}</h3>

      <div className="recipes-column__list">
        {recipes.map((r) => (
          <RecipeCard
            key={r.id}
            title={r.title}
            subtitle={r.mealType}
            tags={r.tags}
          />
        ))}
      </div>
    </section>
  );
}
