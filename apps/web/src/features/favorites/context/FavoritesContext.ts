import { createContext } from "react";

export type FavoriteRecipe = {
  id: string;
  title: string;
  image?: string;
  url?: string;
  source?: string;
};

export type FavoritesContextType = {
  favorites: FavoriteRecipe[];
  addFavorite: (recipe: FavoriteRecipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);
