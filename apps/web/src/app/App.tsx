import { useState } from "react";
import type { FavoriteRecipe } from "../features/favorites/context/FavoritesContext";
import { recipesBoard } from "../features/recipes/data/mockRecipesBoard";
import { HomePage } from "../pages/HomePage";
import { RecipeDetailsPage } from "../pages/RecipeDetailsPage";
import { RecipesPage } from "../pages/RecipesPage";
import type { Recipe } from "../features/recipes/types/recipe.types";
import { AppLayout } from "./AppLayout";

type Page = "home" | "recipes" | "recipe-details";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const openRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setPage("recipe-details");
  };

  const openFavoriteRecipe = (favorite: FavoriteRecipe) => {
    const existingRecipe = recipesBoard.find((recipe) => recipe.id === favorite.id);

    if (existingRecipe) {
      openRecipe(existingRecipe);
      return;
    }

    openRecipe({
      id: favorite.id,
      title: favorite.title,
      imageUrl: favorite.image,
      mealType: "Dinner",
      tags: [],
    });
  };

  const navigate = (nextPage: "home" | "recipes") => {
    setPage(nextPage);
    setSelectedRecipe(null);
  };

  return (
    <AppLayout currentPage={page === "home" ? "home" : "recipes"} onNavigate={navigate}>
      {page === "home" ? <HomePage onOpenFavoriteRecipe={openFavoriteRecipe} /> : null}
      {page === "recipes" ? <RecipesPage onOpenRecipe={openRecipe} /> : null}
      {page === "recipe-details" && selectedRecipe ? (
        <RecipeDetailsPage recipe={selectedRecipe} onBack={() => setPage("recipes")} />
      ) : null}
    </AppLayout>
  );
}
