import { PantryGrid } from "../features/pantry/PantryGrid";
import type { FavoriteRecipe } from "../features/favorites/context/FavoritesContext";
import { useFavorites } from "../features/favorites/context/useFavorites";
import { RecipeCard } from "../features/recipes/components/RecipeCard";
import { useRecipeFavorite } from "../features/recipes/hooks/useRecipeFavorite";

function FavoriteRailCard({
  recipe,
  onOpenRecipe,
}: {
  recipe: FavoriteRecipe;
  onOpenRecipe: (recipe: FavoriteRecipe) => void;
}) {
  const { isFavorited, toggleFavorite, favoriteAriaLabel } = useRecipeFavorite({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    url: recipe.url,
    source: recipe.source,
  });

  return (
    <RecipeCard
      title={recipe.title}
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

  return (
    <div className="page">
      <section className="card">
        <h2>About MealMatch</h2>
        <p>
          MealMatch helps you find recipes based on what you already have at
          home.
        </p>
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Favorites</h2>
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
            <p className="muted">No favorites yet. Tap a heart on Recipes.</p>
          )}
        </div>
      </section>

      <PantryGrid />
    </div>
  );
}
