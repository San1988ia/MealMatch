import { useCallback } from "react";
import { useFavorites } from "../../favorites/context/useFavorites";

type RecipeFavoriteInput = {
  id: string;
  title: string;
  image?: string;
  url?: string;
  source?: string;
};

export function useRecipeFavorite(recipe: RecipeFavoriteInput) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const isFavorited = isFavorite(recipe.id);

  const toggleFavorite = useCallback(() => {
    if (isFavorited) {
      removeFavorite(recipe.id);
      return;
    }

    addFavorite({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      url: recipe.url,
      source: recipe.source,
    });
  }, [addFavorite, isFavorited, recipe.id, recipe.image, recipe.source, recipe.title, recipe.url, removeFavorite]);

  return {
    isFavorited,
    toggleFavorite,
    favoriteAriaLabel: isFavorited
      ? "Remove from favorites"
      : "Add to favorites",
  };
}
