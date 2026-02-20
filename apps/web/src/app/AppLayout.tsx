import { ReactNode } from "react";
import { Header } from "../components/Header/Header";
import { Sidebar } from "../components/Sidebar/Sidebar";

type Page = "home" | "recipes";

type AppLayoutProps = {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function AppLayout({
  children,
  currentPage,
  onNavigate,
}: AppLayoutProps) {
  return (
    <div className="layout">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <main className="main">
        <Header />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
