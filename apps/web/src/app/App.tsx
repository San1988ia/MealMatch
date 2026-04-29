import { useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { FavoriteRecipe } from "../features/favorites/context/FavoritesContext";
import { useFavorites } from "../features/favorites/context/useFavorites";
import { recipesBoard } from "../features/recipes/data/mockRecipesBoard";
import { HomePage } from "../pages/HomePage";
import { RecipeDetailsPage } from "../pages/RecipeDetailsPage";
import { RecipesPage } from "../pages/RecipesPage";
import type { DietTag, Recipe } from "../features/recipes/types/recipe.types";
import { AppLayout } from "./AppLayout";
import type { NavPage } from "./navigation.types";

type MealType = Recipe["mealType"];
type RecipeRouteState = {
  recipe?: Recipe;
  backPage?: NavPage;
};

function toPath(page: NavPage) {
  return page === "home" ? "/" : "/recipes";
}

export default function App() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const { favorites } = useFavorites();

  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [selectedDietTags, setSelectedDietTags] = useState<DietTag[]>([]);

  const currentNavPage: NavPage = location.pathname === "/" ? "home" : "recipes";

  const recipesById = useMemo(() => {
    return new Map(recipesBoard.map((recipe) => [recipe.id, recipe]));
  }, []);

  const favoritesById = useMemo(() => {
    return new Map(favorites.map((favorite) => [favorite.id, favorite]));
  }, [favorites]);

  const openRecipe = (recipe: Recipe) => {
    routerNavigate(`/recipes/${recipe.id}`, {
      state: {
        recipe,
        backPage: currentNavPage,
      } satisfies RecipeRouteState,
    });
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

  const handleNavigate = (nextPage: NavPage) => {
    routerNavigate(toPath(nextPage));
  };

  const handleHeaderSearchSubmit = () => {
    routerNavigate("/recipes");
  };

  const RecipeDetailsRoute = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const state = location.state as RecipeRouteState | null;

    if (!recipeId) {
      return <Navigate to="/recipes" replace />;
    }

    const routeRecipe = state?.recipe;
    const boardRecipe = recipesById.get(recipeId);
    const favoriteRecipe = favoritesById.get(recipeId);

    const resolvedRecipe =
      routeRecipe ??
      boardRecipe ??
      (favoriteRecipe
        ? {
            id: favoriteRecipe.id,
            title: favoriteRecipe.title,
            imageUrl: favoriteRecipe.image,
            mealType: "Dinner",
            tags: [],
          }
        : null);

    if (!resolvedRecipe) {
      return <Navigate to="/recipes" replace />;
    }

    const backPath = toPath(state?.backPage ?? "recipes");

    return <RecipeDetailsPage recipe={resolvedRecipe} onBack={() => routerNavigate(backPath)} />;
  };

  return (
    <AppLayout
      currentPage={currentNavPage}
      onNavigate={handleNavigate}
      recipeSearchQuery={recipeSearchQuery}
      onRecipeSearchQueryChange={setRecipeSearchQuery}
      onRecipeSearchSubmit={handleHeaderSearchSubmit}
    >
      <Routes>
        <Route path="/" element={<HomePage onOpenFavoriteRecipe={openFavoriteRecipe} />} />
        <Route
          path="/recipes"
          element={
            <RecipesPage
              onOpenRecipe={openRecipe}
              searchQuery={recipeSearchQuery}
              onSearchQueryChange={setRecipeSearchQuery}
              selectedMealTypes={selectedMealTypes}
              onSelectedMealTypesChange={setSelectedMealTypes}
              selectedDietTags={selectedDietTags}
              onSelectedDietTagsChange={setSelectedDietTags}
            />
          }
        />
        <Route path="/recipes/:recipeId" element={<RecipeDetailsRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
