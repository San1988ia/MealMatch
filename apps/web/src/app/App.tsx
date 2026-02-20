import { useState } from "react";
import { HomePage } from "../pages/HomePage";
import { RecipesPage } from "../pages/RecipesPage";
import { AppLayout } from "./AppLayout";

type Page = "home" | "recipes";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <AppLayout currentPage={page} onNavigate={(p) => setPage(p)}>
      {page === "home" ? <HomePage /> : <RecipesPage />}
    </AppLayout>
  );
}
