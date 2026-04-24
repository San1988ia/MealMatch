import { useState } from "react";
import type { FavoriteRecipe } from "../features/favorites/context/FavoritesContext";
import { recipesBoard } from "../features/recipes/data/mockRecipesBoard";
import { HomePage } from "../pages/HomePage";
import { RecipeDetailsPage } from "../pages/RecipeDetailsPage";
import { RecipesPage } from "../pages/RecipesPage";
import type { DietTag, Recipe } from "../features/recipes/types/recipe.types";
import { AppLayout } from "./AppLayout";

type Page = "home" | "recipes" | "recipe-details";
type MealType = Recipe["mealType"];
type NavPage = "home" | "recipes";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeBackPage, setRecipeBackPage] = useState<NavPage>("home");
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [selectedDietTags, setSelectedDietTags] = useState<DietTag[]>([]);

  const currentNavPage: NavPage = page === "recipe-details" ? recipeBackPage : page;

  const openRecipe = (recipe: Recipe) => {
    setRecipeBackPage(currentNavPage);
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

  const navigate = (nextPage: NavPage) => {
    setPage(nextPage);
    setSelectedRecipe(null);
  };

  const handleHeaderSearchSubmit = () => {
    setPage("recipes");
    setSelectedRecipe(null);
  };

  return (
    <AppLayout
      currentPage={currentNavPage}
      onNavigate={navigate}
      recipeSearchQuery={recipeSearchQuery}
      onRecipeSearchQueryChange={setRecipeSearchQuery}
      onRecipeSearchSubmit={handleHeaderSearchSubmit}
    >
      {page === "home" ? <HomePage onOpenFavoriteRecipe={openFavoriteRecipe} /> : null}
      {page === "recipes" ? (
        <RecipesPage
          onOpenRecipe={openRecipe}
          searchQuery={recipeSearchQuery}
          onSearchQueryChange={setRecipeSearchQuery}
          selectedMealTypes={selectedMealTypes}
          onSelectedMealTypesChange={setSelectedMealTypes}
          selectedDietTags={selectedDietTags}
          onSelectedDietTagsChange={setSelectedDietTags}
        />
      ) : null}
      {page === "recipe-details" && selectedRecipe ? (
        <RecipeDetailsPage recipe={selectedRecipe} onBack={() => navigate(recipeBackPage)} />
      ) : null}
    </AppLayout>
  );
}
