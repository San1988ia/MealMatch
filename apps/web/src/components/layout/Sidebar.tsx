import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { NavPage } from "../../app/navigation.types";
import "./Sidebar.scss";

type SidebarProps = {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
};

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleNavigate = (page: NavPage) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="sidebar__nav">
        <button
          className="ham-menu"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t("sidebar.toggle")}
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
            {t("sidebar.home")}
          </button>

          <button
            className={`sidebar__link ${currentPage === "recipes" ? "is-active" : ""}`}
            onClick={() => handleNavigate("recipes")}
            type="button"
          >
            {t("sidebar.recipes")}
          </button>

          <div className="sidebar__divider" />

          <div className="sidebar__hint muted">{t("sidebar.categoriesSoon")}</div>
        </div>
      </aside>
    </>
  );
}
