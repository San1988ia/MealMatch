export type MealMatchRecipe = {
  id: string;
  title: string;
  image?: string;
  source?: "edamam" | "mealdb";
  url?: string;
};
