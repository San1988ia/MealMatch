import type { MealMatchRecipe } from "../types/recipe";

const BASE = "https://www.themealdb.com/api/json/v1/1";

type MealDbMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
  strSource?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
};

export async function mealdbSearch(query: string): Promise<MealMatchRecipe[]> {
  const firstIngredient = query.split(" ")[0];
  const url = `${BASE}/search.php?s=${encodeURIComponent(firstIngredient)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MealDB error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    meals: null | MealDbMeal[];
  };

  const meals = data.meals ?? [];

  return meals.map((m) => {
    const ingredients: MealMatchRecipe["ingredients"] = [];

    for (let i = 1; i <= 20; i++) {
      const ing = m[`strIngredient${i}`];
      if (ing?.trim()) {
        ingredients.push({
          name: ing.trim().toLowerCase(),
        });
      }
    }

    return {
      id: m.idMeal,
      title: m.strMeal,
      image: m.strMealThumb,
      url: m.strSource || m.strYoutube || undefined,
      source: "mealdb",
      ingredients,
    };
  });
}
