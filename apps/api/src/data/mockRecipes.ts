import type { MealMatchRecipe } from "../types/recipe";

export const mockRecipes: MealMatchRecipe[] = [
  {
    id: "mock-1",
    title: "Pancakes",
    source: "mock",
    ingredients: [
      { name: "egg", quantity: 2, unit: "pcs" },
      { name: "milk", quantity: 3, unit: "dl" },
      { name: "flour", quantity: 200, unit: "g" },
    ],
  },
  {
    id: "mock-2",
    title: "Omelette",
    source: "mock",
    ingredients: [
      { name: "egg", quantity: 3, unit: "pcs" },
      { name: "milk", quantity: 1, unit: "dl" },
      { name: "cheese", quantity: 50, unit: "g" },
    ],
  },
  {
    id: "mock-3",
    title: "Smoothie",
    source: "mock",
    ingredients: [
      { name: "banana", quantity: 1, unit: "pcs" },
      { name: "milk", quantity: 2, unit: "dl" },
      { name: "oats", quantity: 50, unit: "g" },
    ],
  },
  {
    id: "mock-4",
    title: "Scrambled Eggs",
    source: "mock",
    ingredients: [
      { name: "egg", quantity: 2, unit: "pcs" },
      { name: "butter", quantity: 10, unit: "g" },
      { name: "milk", quantity: 1, unit: "tbsp" },
    ],
  },
];
