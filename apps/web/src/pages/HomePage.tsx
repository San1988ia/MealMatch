import { PantryGrid } from "../features/pantry/components/PantryGrid";
import { RecipeCard } from "../features/recipes/components/RecipeCard";
import { favoriteRecipes } from "../features/recipes/data/mockRecipes";

export function HomePage() {
  return (
    <div className="page">
      <section className="card">
        <h2>About MealMatch</h2>
        <p>
          MealMatch helps you find recipes based on what you already have at
          home.
        </p>
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Favorites</h2>
          <span className="muted">♡</span>
        </div>

        <div className="horizontal-scroll">
          {favoriteRecipes.map((r) => (
            <RecipeCard
              key={r.id}
              title={r.title}
              subtitle={r.mealType}
              tags={r.tags}
              imageUrl={r.imageUrl}
            />
          ))}
        </div>
      </section>

      <PantryGrid />
    </div>
  );
}
