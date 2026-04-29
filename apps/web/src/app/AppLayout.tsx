import type { ReactNode } from "react";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";

type Page = "home" | "recipes";

type AppLayoutProps = {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  recipeSearchQuery: string;
  onRecipeSearchQueryChange: (query: string) => void;
  onRecipeSearchSubmit: () => void;
};

export function AppLayout({
  children,
  currentPage,
  onNavigate,
  recipeSearchQuery,
  onRecipeSearchQueryChange,
  onRecipeSearchSubmit,
}: AppLayoutProps) {
  return (
    <div className="layout">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <main className="main">
        <Header
          currentPage={currentPage}
          recipeSearchQuery={recipeSearchQuery}
          onRecipeSearchQueryChange={onRecipeSearchQueryChange}
          onRecipeSearchSubmit={onRecipeSearchSubmit}
        />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
