import type { Recipe } from "./recipes.types";

export const recipesBoard: Recipe[] = [
  { id: "r1", title: "Veggie tacos", mealType: "Dinner", tags: ["Vegetarian"] },
  { id: "r2", title: "Halloumi bowl", mealType: "Lunch", tags: ["Vegetarian"] },

  {
    id: "r3",
    title: "Omelett",
    mealType: "Breakfast",
    tags: ["Gluten Free", "High Protein"],
  },
  {
    id: "r4",
    title: "Kycklingsallad",
    mealType: "Lunch",
    tags: ["Gluten Free", "Low Carb"],
  },

  {
    id: "r5",
    title: "Overnight oats",
    mealType: "Breakfast",
    tags: ["High Fiber"],
  },
  {
    id: "r6",
    title: "Linsgryta",
    mealType: "Dinner",
    tags: ["High Fiber", "Vegetarian"],
  },

  {
    id: "r7",
    title: "Kvarg med bär",
    mealType: "Snack",
    tags: ["High Protein"],
  },
  {
    id: "r8",
    title: "Tonfisksallad",
    mealType: "Lunch",
    tags: ["High Protein", "Low Carb"],
  },

  {
    id: "r9",
    title: "Zucchini pasta",
    mealType: "Dinner",
    tags: ["Low Carb", "Vegetarian"],
  },
];
