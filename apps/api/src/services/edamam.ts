import type { MealMatchRecipe } from "../types/recipe";

const BASE = "https://api.edamam.com";

export async function edamamSearch(query: string): Promise<MealMatchRecipe[]> {
  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;

  if (!appId || !appKey) return [];

  const url =
    `${BASE}/api/recipes/v2` +
    `?type=public` +
    `&q=${encodeURIComponent(query)}` +
    `&app_id=${encodeURIComponent(appId)}` +
    `&app_key=${encodeURIComponent(appKey)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Edamam error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    hits?: Array<{
      recipe: {
        uri: string;
        label: string;
        image?: string;
        url?: string;
        ingredientLines?: string[];
      };
    }>;
  };

  const hits = data.hits ?? [];

  return hits.map((h) => ({
    id: h.recipe.uri,
    title: h.recipe.label,
    image: h.recipe.image,
    url: h.recipe.url,
    source: "edamam",
    ingredients: (h.recipe.ingredientLines ?? []).map((line) => ({
      name: line.trim().toLowerCase(),
    })),
  }));
}
