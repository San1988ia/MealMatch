import { PantryGrid } from "../features/pantry/PantryGrid";
import { RecipeCard } from "../features/recipes/RecipeCard";
import { favoriteRecipes } from "../features/recipes/mockRecipes";

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
              subtitle={r.subtitle}
              tags={[...r.tags]}
            />
          ))}
        </div>
      </section>

      <PantryGrid />
    </div>
  );
}
