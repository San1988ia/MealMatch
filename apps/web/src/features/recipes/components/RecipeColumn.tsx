import type { Recipe } from "../types/recipe.types";
import { useRecipeFavorite } from "../hooks/useRecipeFavorite";
import { RecipeCard } from "./RecipeCard";

type RecipeColumnProps = {
  title: string;
  recipes: Recipe[];
  onOpenRecipe: (recipe: Recipe) => void;
};

function FavoriteRecipeCard({
  recipe,
  onOpenRecipe,
}: {
  recipe: Recipe;
  onOpenRecipe: (recipe: Recipe) => void;
}) {
  const { isFavorited, toggleFavorite, favoriteAriaLabel } = useRecipeFavorite({
    id: recipe.id,
    title: recipe.title,
    image: recipe.imageUrl,
  });

  return (
    <RecipeCard
      title={recipe.title}
      subtitle={recipe.mealType}
      tags={recipe.tags}
      imageUrl={recipe.imageUrl}
      onClick={() => onOpenRecipe(recipe)}
      showFavoriteButton
      isFavorited={isFavorited}
      onToggleFavorite={toggleFavorite}
      favoriteAriaLabel={favoriteAriaLabel}
    />
  );
}

export function RecipeColumn({
  title,
  recipes,
  onOpenRecipe,
}: RecipeColumnProps) {
  return (
    <section className="recipes-column">
      <h3 className="recipes-column__title">{title}</h3>

      <div className="recipes-column__list">
        {recipes.map((r) => (
          <FavoriteRecipeCard key={r.id} recipe={r} onOpenRecipe={onOpenRecipe} />
        ))}
      </div>
    </section>
  );
}
