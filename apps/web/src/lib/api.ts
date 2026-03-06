const API_BASE = "http://localhost:4000";

export async function suggestRecipes(ingredients: string[]) {
  const res = await fetch(`${API_BASE}/api/recipes/suggest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredients }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return res.json();
}
