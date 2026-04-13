import type { Recipe } from "../types/recipe.types";
import { useRecipeFavorite } from "../hooks/useRecipeFavorite";
import { RecipeCard } from "./RecipeCard";

type RecipeColumnProps = {
  title: string;
  recipes: Recipe[];
};

function FavoriteRecipeCard({ recipe }: { recipe: Recipe }) {
  const { isFavorited, toggleFavorite, favoriteAriaLabel } = useRecipeFavorite({
    id: recipe.id,
    title: recipe.title,
  });

  return (
    <RecipeCard
      title={recipe.title}
      subtitle={recipe.mealType}
      tags={recipe.tags}
      showFavoriteButton
      isFavorited={isFavorited}
      onToggleFavorite={toggleFavorite}
      favoriteAriaLabel={favoriteAriaLabel}
    />
  );
}

export function RecipeColumn({ title, recipes }: RecipeColumnProps) {
  return (
    <section className="recipes-column">
      <h3 className="recipes-column__title">{title}</h3>

      <div className="recipes-column__list">
        {recipes.map((r) => (
          <FavoriteRecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </section>
  );
}
