export type DietTag =
  | "Vegetarian"
  | "Gluten Free"
  | "High Fiber"
  | "High Protein"
  | "Low Carb";

export type RecipeNutrition = {
  calories: number;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  breakdown: {
    carbs: number;
    protein: number;
    fat: number;
  };
};

export type Recipe = {
  id: string;
  title: string;
  mealType: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Dessert";
  tags: DietTag[];
  imageUrl?: string;
  ingredients?: string[];
  instructions?: string[];
  nutrition?: RecipeNutrition;
};
