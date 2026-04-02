import { useState } from "react";
import "./Sidebar.scss";

type Page = "home" | "recipes";

type SidebarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="sidebar__nav">
        <button
          className="ham-menu"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="sidebar-off-screen">
          <div className="sidebar__brand bagel-fat-one-regular">
            <div className="sidebar__logo">
              <img
                src="/images/HamburgerHeart.PNG"
                alt="MealMatch logo"
                className="sidebar__logo-image"
              />
              <span className="meal">Meal</span>
              <span className="match">Match</span>
            </div>
          </div>

          <button
            className={`sidebar__link ${currentPage === "home" ? "is-active" : ""}`}
            onClick={() => handleNavigate("home")}
            type="button"
          >
            Home
          </button>

          <button
            className={`sidebar__link ${currentPage === "recipes" ? "is-active" : ""}`}
            onClick={() => handleNavigate("recipes")}
            type="button"
          >
            Recipes
          </button>

          <div className="sidebar__divider" />

          <div className="sidebar__hint muted">(kategorier kommer senare)</div>
        </div>
      </aside>
    </>
  );
}
