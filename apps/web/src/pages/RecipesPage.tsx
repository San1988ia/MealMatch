import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecipeFavorite } from "../features/recipes/hooks/useRecipeFavorite";
import { RecipeCard } from "../features/recipes/components/RecipeCard";
import { RecipeColumn } from "../features/recipes/components/RecipeColumn";
import { recipesBoard } from "../features/recipes/data/mockRecipesBoard";
import type { DietTag, Recipe } from "../features/recipes/types/recipe.types";
import "./RecipesBoard.scss";
import "./RecipesFilters.scss";

const columns: DietTag[] = [
  "Vegetarian",
  "Gluten Free",
  "High Fiber",
  "High Protein",
  "Low Carb",
];

const mealTypeOptions: Recipe["mealType"][] = [
  "Breakfast",
  "Lunch",
  "Snack",
  "Dinner",
  "Dessert",
];

function FilteredRecipeCard({
  recipe,
  onOpenRecipe,
}: {
  recipe: Recipe;
  onOpenRecipe: (recipe: Recipe) => void;
}) {
  const { isFavorited, toggleFavorite, favoriteAriaLabel } = useRecipeFavorite({
    id: recipe.id,
    title: recipe.title,
    image: recipe.imageUrl,
  });

  return (
    <RecipeCard
      title={recipe.title}
      subtitle={recipe.mealType}
      tags={recipe.tags}
      imageUrl={recipe.imageUrl}
      onClick={() => onOpenRecipe(recipe)}
      showFavoriteButton
      isFavorited={isFavorited}
      onToggleFavorite={toggleFavorite}
      favoriteAriaLabel={favoriteAriaLabel}
    />
  );
}

type RecipesPageProps = {
  onOpenRecipe: (recipe: Recipe) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedMealTypes: Recipe["mealType"][];
  onSelectedMealTypesChange: (mealTypes: Recipe["mealType"][]) => void;
  selectedDietTags: DietTag[];
  onSelectedDietTagsChange: (tags: DietTag[]) => void;
};

export function RecipesPage({
  onOpenRecipe,
  searchQuery,
  onSearchQueryChange,
  selectedMealTypes,
  onSelectedMealTypesChange,
  selectedDietTags,
  onSelectedDietTagsChange,
}: RecipesPageProps) {
  const { t } = useTranslation();

  const byTag = useMemo(() => {
    const map = new Map<DietTag, Recipe[]>();
    for (const tag of columns) map.set(tag, []);
    for (const r of recipesBoard) {
      for (const tag of r.tags) {
        map.get(tag)?.push(r);
      }
    }
    return map;
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredRecipes = useMemo(() => {
    return recipesBoard.filter((recipe) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        recipe.title.toLowerCase().includes(normalizedQuery);
      const matchesMealType =
        selectedMealTypes.length === 0 ||
        selectedMealTypes.includes(recipe.mealType);
      const matchesDietTags =
        selectedDietTags.length === 0 ||
        selectedDietTags.every((tag) => recipe.tags.includes(tag));

      return matchesQuery && matchesMealType && matchesDietTags;
    });
  }, [normalizedQuery, selectedDietTags, selectedMealTypes]);

  const hasActiveFilters =
    normalizedQuery.length > 0 ||
    selectedMealTypes.length > 0 ||
    selectedDietTags.length > 0;

  const toggleMealType = (mealType: Recipe["mealType"]) => {
    onSelectedMealTypesChange(
      selectedMealTypes.includes(mealType)
        ? selectedMealTypes.filter((value) => value !== mealType)
        : [...selectedMealTypes, mealType],
    );
  };

  const toggleDietTag = (tag: DietTag) => {
    onSelectedDietTagsChange(
      selectedDietTags.includes(tag)
        ? selectedDietTags.filter((value) => value !== tag)
        : [...selectedDietTags, tag],
    );
  };

  const clearFilters = () => {
    onSearchQueryChange("");
    onSelectedMealTypesChange([]);
    onSelectedDietTagsChange([]);
  };

  return (
    <div className="page">
      <section className="card">
        <div className="section-header recipes-page__header">
          <h2>{t("recipes.title")}</h2>

          {hasActiveFilters ? (
            <button className="recipes-filters__clear" type="button" onClick={clearFilters}>
              {t("recipes.clearFilters")}
            </button>
          ) : null}
        </div>

        <div className="recipes-filters">
          <div className="recipes-filters__search">
            <label htmlFor="recipes-search" className="visually-hidden">
              {t("header.searchRecipes")}
            </label>
            <input
              id="recipes-search"
              type="search"
              placeholder={t("recipes.searchPlaceholder")}
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
            />
          </div>

          <fieldset className="recipes-filters__group">
            <legend>{t("recipes.mealType")}</legend>
            <div className="recipes-filters__options">
              {mealTypeOptions.map((mealType) => (
                <label key={mealType} className="recipes-filters__option">
                  <input
                    type="checkbox"
                    checked={selectedMealTypes.includes(mealType)}
                    onChange={() => toggleMealType(mealType)}
                  />
                  <span>{mealType}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="recipes-filters__group">
            <legend>{t("recipes.category")}</legend>
            <div className="recipes-filters__options">
              {columns.map((tag) => (
                <label key={tag} className="recipes-filters__option">
                  <input
                    type="checkbox"
                    checked={selectedDietTags.includes(tag)}
                    onChange={() => toggleDietTag(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {hasActiveFilters ? (
        <section className="card recipes-results">
          <div className="section-header recipes-results__header">
            <h3>{t("recipes.results")}</h3>
            <span className="muted">
              {t("recipes.resultCount", { count: filteredRecipes.length })}
            </span>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="recipes-results__grid">
              {filteredRecipes.map((recipe) => (
                <FilteredRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpenRecipe={onOpenRecipe}
                />
              ))}
            </div>
          ) : (
            <p className="muted recipes-results__empty">
              {t("recipes.noResults")}
            </p>
          )}
        </section>
      ) : (
        <section className="recipes-board">
          {columns.map((tag) => (
            <RecipeColumn
              key={tag}
              title={tag}
              recipes={byTag.get(tag) ?? []}
              onOpenRecipe={onOpenRecipe}
            />
          ))}
        </section>
      )}
    </div>
  );
}
