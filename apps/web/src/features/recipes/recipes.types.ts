export type DietTag =
  | "Vegetarian"
  | "Gluten Free"
  | "High Fiber"
  | "High Protein"
  | "Low Carb";

export type Recipe = {
  id: string;
  title: string;
  mealType?: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Dessert";
  tags: DietTag[];
};
