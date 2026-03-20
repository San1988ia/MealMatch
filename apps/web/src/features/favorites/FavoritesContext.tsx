import { createContext, ReactNode, useContext, useState } from "react";

type FavoriteRecipe = {
  id: string;
  title: string;
  image?: string;
  url?: string;
  source?: string;
};

type FavoritesContextType = {
  favorites: FavoriteRecipe[];
  addFavorite: (recipe: FavoriteRecipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(() => {
    const saved = localStorage.getItem("mealMatch_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const addFavorite = (recipe: FavoriteRecipe) => {
    setFavorites((prev) => {
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

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
