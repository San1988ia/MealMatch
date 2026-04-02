import type { ReactNode } from "react";
import { useState } from "react";
import { FavoritesContext, type FavoriteRecipe } from "./FavoritesContext";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(() => {
    const saved = localStorage.getItem("mealMatch_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const addFavorite = (recipe: FavoriteRecipe) => {
    setFavorites((prev) => {
      if (prev.some((r) => r.id === recipe.id)) {
        return prev;
      }

      const updated = [...prev, recipe];
      localStorage.setItem("mealMatch_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem("mealMatch_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.some((r) => r.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
