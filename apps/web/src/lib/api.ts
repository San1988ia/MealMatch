import type { PantryItem } from "../features/pantry/types/pantry.types";
import type { Suggestion } from "../features/recipes/types/suggestion.types";
const API_BASE = "http://localhost:4000";

type SuggestRecipesResponse = {
  recipes: Suggestion[];
};

export async function suggestRecipes(
  pantry: PantryItem[],
): Promise<SuggestRecipesResponse> {
  const res = await fetch(`${API_BASE}/api/recipes/suggest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pantry }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return res.json();
}
