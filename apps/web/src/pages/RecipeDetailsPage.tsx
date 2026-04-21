import type { Recipe } from "../features/recipes/types/recipe.types";
import { useRecipeFavorite } from "../features/recipes/hooks/useRecipeFavorite";

type RecipeDetailsPageProps = {
  recipe: Recipe;
  onBack: () => void;
};

export function RecipeDetailsPage({ recipe, onBack }: RecipeDetailsPageProps) {
  const ingredients = recipe.ingredients ?? [];
  const instructions = recipe.instructions ?? [];
  const { isFavorited, toggleFavorite, favoriteAriaLabel } = useRecipeFavorite({
    id: recipe.id,
    title: recipe.title,
    image: recipe.imageUrl,
  });

  return (
    <div className="page">
      <section className="card recipe-details-card">
     <button
      type="button"
      className="recipe-details__back"
      onClick={onBack}
     >
  <span className="back-icon">←</span>
  <span>Back</span>
     </button>

        <div className="recipe-details__hero">
          <div className="recipe-details__image-wrap">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="recipe-details__image"
              />
            ) : (
              <div className="recipe-details__image recipe-details__image--placeholder" />
            )}
          </div>

          <div className="recipe-details__meta">
            <div className="recipe-details__title-row">
              <h2 className="recipe-details__title">{recipe.title}</h2>
              <button
                type="button"
                className={`recipe-details__favorite-btn${isFavorited ? " is-active" : ""}`}
                aria-label={favoriteAriaLabel}
                aria-pressed={isFavorited}
                onClick={toggleFavorite}
              >
                {isFavorited ? (
                  <img
                    src="/images/HamburgerHeart.PNG"
                    alt=""
                    aria-hidden="true"
                    className="recipe-details__favorite-icon"
                  />
                ) : (
                  <span className="recipe-details__favorite-fallback">♡</span>
                )}
              </button>
            </div>
            <p className="muted">{recipe.mealType}</p>

            <h3>Ingredients</h3>
            {ingredients.length > 0 ? (
              <ul className="recipe-details__ingredients">
                {ingredients.map((ingredient, index) => (
                  <li key={`ingredient-${recipe.id}-${index}-${ingredient}`}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">Ingredients are not available yet.</p>
            )}
          </div>
        </div>

        <div className="recipe-details__body">
          <section className="recipe-details__section">
            <h3>Cooking instructions</h3>
            {instructions.length > 0 ? (
              <ol className="recipe-details__instructions">
                {instructions.map((step, index) => (
                  <li key={`instruction-${recipe.id}-${index}-${step}`}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="muted">Cooking instructions are not available yet.</p>
            )}
          </section>

          <section className="recipe-details__section">
            <h3>Nutrition</h3>
            {recipe.nutrition ? (
              <div className="recipe-details__nutrition-grid">
                <div className="recipe-details__nutrition-item">
                  <span>Calories</span>
                  <strong>{recipe.nutrition.calories} kcal</strong>
                </div>
                <div className="recipe-details__nutrition-item">
                  <span>Protein</span>
                  <strong>{recipe.nutrition.proteinGrams} g</strong>
                </div>
                <div className="recipe-details__nutrition-item">
                  <span>Carbs</span>
                  <strong>{recipe.nutrition.carbsGrams} g</strong>
                </div>
                <div className="recipe-details__nutrition-item">
                  <span>Fat</span>
                  <strong>{recipe.nutrition.fatGrams} g</strong>
                </div>
                {recipe.nutrition.fiberGrams != null ? (
                  <div className="recipe-details__nutrition-item">
                    <span>Fiber</span>
                    <strong>{recipe.nutrition.fiberGrams} g</strong>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="muted">Nutrition data is not available yet.</p>
            )}

            {recipe.nutrition ? (
              <div className="recipe-details__breakdown">
                <p className="recipe-details__breakdown-title">Nutrition breakdown</p>
                <ul>
                  <li>Carbs: {recipe.nutrition.breakdown.carbs}%</li>
                  <li>Protein: {recipe.nutrition.breakdown.protein}%</li>
                  <li>Fat: {recipe.nutrition.breakdown.fat}%</li>
                </ul>
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </div>
  );
}
