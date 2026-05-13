import type { TFunction } from "i18next";
import type { DietTag, Recipe } from "../types/recipe.types";

type RecipeIdentity = Pick<Recipe, "id" | "title">;

export function getLocalizedRecipeTitle(t: TFunction, recipe: RecipeIdentity) {
  return t(`recipeTitle.${recipe.id}`, { defaultValue: recipe.title });
}

export function getLocalizedMealType(t: TFunction, mealType: Recipe["mealType"]) {
  return t(`mealType.${mealType}`, { defaultValue: mealType });
}

export function getLocalizedDietTag(t: TFunction, tag: DietTag) {
  return t(`dietTag.${tag}`, { defaultValue: tag });
}