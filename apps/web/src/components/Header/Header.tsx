import "./styles/Header.scss";

export function Header() {
  return (
    <header className="header">
      <img src="/images/HamburgerHeart.PNG" alt="MealMatch logo" className="header__logo" />
      <h1 className="header__title bagel-fat-one-regular">
        <span className="meal">Meal</span>
        <span className="match">Match</span>  
      </h1>
    </header>
  );
}
