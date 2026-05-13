import { useTranslation } from "react-i18next";
import { getLocalizedDietTag, getLocalizedMealType, getLocalizedRecipeTitle } from "../lib/recipeLocalization";
import type { DietTag, Recipe } from "../types/recipe.types";
import { useRecipeFavorite } from "../hooks/useRecipeFavorite";
import { RecipeCard } from "./RecipeCard";

type RecipeColumnProps = {
  title: DietTag;
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
  const { t } = useTranslation();
  const { isFavorited, toggleFavorite, favoriteAriaLabel } = useRecipeFavorite({
    id: recipe.id,
    title: recipe.title,
    image: recipe.imageUrl,
  });

  return (
    <RecipeCard
      title={getLocalizedRecipeTitle(t, recipe)}
      subtitle={getLocalizedMealType(t, recipe.mealType)}
      tags={recipe.tags.map((tag) => getLocalizedDietTag(t, tag))}
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
  const { t } = useTranslation();

  return (
    <section className="recipes-column">
      <h3 className="recipes-column__title">{getLocalizedDietTag(t, title)}</h3>

      <div className="recipes-column__list">
        {recipes.map((r) => (
          <FavoriteRecipeCard key={r.id} recipe={r} onOpenRecipe={onOpenRecipe} />
        ))}
      </div>
    </section>
  );
}
