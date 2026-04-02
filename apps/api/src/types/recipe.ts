export type RecipeIngredient = {
  name: string;
  quantity?: number;
  unit?: string;
};

export type MealMatchRecipe = {
  id: string;
  title: string;
  image?: string;
  source?: string;
  url?: string;
  ingredients: RecipeIngredient[];
};
