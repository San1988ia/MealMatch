import type { FormEvent } from "react";
import type { NavPage } from "../../app/navigation.types.ts";
import "./Header.scss";

type HeaderProps = {
  currentPage: NavPage;
  recipeSearchQuery: string;
  onRecipeSearchQueryChange: (query: string) => void;
  onRecipeSearchSubmit: () => void;
};

export function Header({
  currentPage,
  recipeSearchQuery,
  onRecipeSearchQueryChange,
  onRecipeSearchSubmit,
}: HeaderProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRecipeSearchSubmit();
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img
          src="/images/HamburgerHeart.PNG"
          alt="MealMatch logo"
          className="header__logo"
        />
        <h1 className="header__title bagel-fat-one-regular">
          <span className="meal">Meal</span>
          <span className="match">Match</span>
        </h1>
      </div>

      {currentPage !== "recipes" ? (
        <form className="header__search" onSubmit={handleSubmit} role="search">
          <label className="visually-hidden" htmlFor="header-recipe-search">
            Search recipes
          </label>
          <input
            id="header-recipe-search"
            className="header__search-input"
            type="search"
            placeholder="Search recipes"
            value={recipeSearchQuery}
            onChange={(event) => onRecipeSearchQueryChange(event.target.value)}
          />
          <button className="header__search-button" type="submit">
            Search
          </button>
        </form>
      ) : null}
    </header>
  );
}
