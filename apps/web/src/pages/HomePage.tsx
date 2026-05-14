import { PantryGrid } from "../features/pantry/PantryGrid";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { FavoriteRecipe } from "../features/favorites/context/FavoritesContext";
import { useFavorites } from "../features/favorites/context/useFavorites";
import { RecipeCard } from "../features/recipes/components/RecipeCard";
import { getLocalizedRecipeTitle } from "../features/recipes/lib/recipeLocalization";
import { useRecipeFavorite } from "../features/recipes/hooks/useRecipeFavorite";
import "./HomePage.scss";

function FavoriteRailCard({
  recipe,
  onOpenRecipe,
}: {
  recipe: FavoriteRecipe;
  onOpenRecipe: (recipe: FavoriteRecipe) => void;
}) {
  const { t } = useTranslation();
  const { isFavorited, toggleFavorite, favoriteAriaLabel } = useRecipeFavorite({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    url: recipe.url,
    source: recipe.source,
  });

  return (
    <RecipeCard
      title={getLocalizedRecipeTitle(t, recipe)}
      imageUrl={recipe.image}
      onClick={() => onOpenRecipe(recipe)}
      source={recipe.source}
      showFavoriteButton
      isFavorited={isFavorited}
      onToggleFavorite={toggleFavorite}
      favoriteAriaLabel={favoriteAriaLabel}
    />
  );
}

type HomePageProps = {
  onOpenFavoriteRecipe: (recipe: FavoriteRecipe) => void;
};

export function HomePage({ onOpenFavoriteRecipe }: HomePageProps) {
  const { favorites } = useFavorites();
  const { t } = useTranslation();
  const [showAbout, setShowAbout] = useState(true);

  return (
    <div className="page">
      {showAbout ? (
        <section className="card about-card">
          <button
            className="about-card__close"
            aria-label="Close information about MealMatch"
            onClick={() => setShowAbout(false)}
          >
            &times;
          </button>
          <h2>{t("home.aboutTitle")}</h2>
          <p>{t("home.aboutText")}</p>
        </section>
      ) : (
        <button
          type="button"
          className="about-card__reopen"
          aria-label="Show information about MealMatch"
          onClick={() => setShowAbout(true)}
        >
          i
        </button>
      )}

      <section className="card">
        <div className="section-header">
          <h2>{t("home.favorites")}</h2>
          <span className="muted">♡</span>
        </div>

        <div className="horizontal-scroll horizontal-scroll--favorites">
          {favorites.length > 0 ? (
            favorites.map((r) => (
              <FavoriteRailCard
                key={r.id}
                recipe={r}
                onOpenRecipe={onOpenFavoriteRecipe}
              />
            ))
          ) : (
            <p className="muted">{t("home.noFavorites")}</p>
          )}
        </div>
      </section>

      <PantryGrid />
    </div>
  );
}

