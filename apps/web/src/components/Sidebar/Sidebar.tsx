type Page = "home" | "recipes";

type SidebarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">MealMatch</div>

      <nav className="sidebar__nav">
        <button
          className={`sidebar__link ${currentPage === "home" ? "is-active" : ""}`}
          onClick={() => onNavigate("home")}
          type="button"
        >
          Home
        </button>

        <button
          className={`sidebar__link ${currentPage === "recipes" ? "is-active" : ""}`}
          onClick={() => onNavigate("recipes")}
          type="button"
        >
          Recipes
        </button>

        <div className="sidebar__divider" />

        <div className="muted" style={{ fontSize: 12 }}>
          (kategorier kommer senare)
        </div>
      </nav>
    </aside>
  );
}
