import { useState } from "react";
import "./styles/Sidebar.scss";

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
          <div className="sidebar__logo">MealMatch</div>

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

          <div className="muted" style={{ fontSize: 12 }}>
            (kategorier kommer senare)
          </div>
        </div>
      </aside>
    </>
  );
}
