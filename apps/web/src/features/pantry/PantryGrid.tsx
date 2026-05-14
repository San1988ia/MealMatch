import { AgGridReact } from "ag-grid-react";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { RecipeCard } from "../recipes/components/RecipeCard";
import { recipesBoard } from "../recipes/data/mockRecipesBoard";
import {
  getLocalizedDietTag,
  getLocalizedMealType,
  getLocalizedRecipeTitle,
} from "../recipes/lib/recipeLocalization";
import type { Recipe } from "../recipes/types/recipe.types";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import type { PantryItem } from "./pantry.types";
import { PantryModal } from "./PantryModal";
import "./PantryGrid.scss";

export function PantryGrid() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState<PantryItem[]>([
    { id: "1", name: "eggs", quantity: 6, unit: "pcs" },
    { id: "2", name: "flour", quantity: 1, unit: "kg" },
    { id: "3", name: "milk", quantity: 1, unit: "l" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | undefined>();
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 640 : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsCompact(window.innerWidth <= 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleEdit = useCallback((item: PantryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setRowData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const columnDefs = useMemo(
    () => [
      { field: "name", headerName: t("pantry.ingredient"), editable: true, flex: 1 },
      {
        field: "quantity",
        headerName: t("pantry.quantity"),
        editable: true,
        width: isCompact ? 95 : 120,
      },
      {
        field: "unit",
        headerName: t("pantry.unit"),
        editable: true,
        width: isCompact ? 95 : 120,
      },
      {
        headerName: t("pantry.actions"),
        width: isCompact ? 100 : 120,
        cellRenderer: (params: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
          <div className="pantry__cell-actions">
            <button
              className="pantry__cell-btn pantry__cell-btn--edit"
              onClick={() => handleEdit(params.data)}
              title={t("pantry.edit")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </button>
            <button
              className="pantry__cell-btn pantry__cell-btn--delete"
              onClick={() => handleDelete(params.data.id)}
              title={t("pantry.delete")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleEdit, isCompact, t],
  );

  const handleSave = (item: PantryItem) => {
    if (editingItem) {
      // Update existing
      setRowData((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...item, id: editingItem.id } : i))
      );
    } else {
      // Add new
      const newItem = { ...item, id: Date.now().toString() };
      setRowData((prev) => [...prev, newItem]);
    }
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const normalize = (value: string) => value.trim().toLowerCase();

  const singularize = (value: string) =>
    value.endsWith("s") ? value.slice(0, -1) : value;

  const ingredientMatchesPantryItem = (
    ingredientLine: string,
    pantryItemName: string,
  ) => {
    const ingredient = singularize(normalize(ingredientLine));
    const pantryName = singularize(normalize(pantryItemName));
    return ingredient.includes(pantryName) || pantryName.includes(ingredient);
  };

  const handleSuggest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const pantry = rowData
        .map((item) => ({
          name: item.name.trim().toLowerCase(),
          quantity: Number(item.quantity),
          unit: item.unit.trim().toLowerCase(),
        }))
        .filter(
          (item) =>
            item.name.length > 0 && item.unit.length > 0 && item.quantity > 0,
        );

      if (pantry.length === 0) {
        setError(t("pantry.invalidIngredientError"));
        setSuggestedRecipes([]);
        return;
      }

      const pantryNames = pantry.map((item) => item.name);

      const matchedRecipes = recipesBoard
        .filter((recipe) => {
          const recipeIngredients = recipe.ingredients ?? [];

          return pantryNames.some((pantryName) =>
            recipeIngredients.some((ingredientLine) =>
              ingredientMatchesPantryItem(ingredientLine, pantryName),
            ),
          );
        })
        .map((recipe) => {
          const recipeIngredients = recipe.ingredients ?? [];
          const haveCount = pantryNames.filter((pantryName) =>
            recipeIngredients.some((ingredientLine) =>
              ingredientMatchesPantryItem(ingredientLine, pantryName),
            ),
          ).length;

          return {
            recipe,
            score: haveCount / Math.max(recipeIngredients.length, 1),
          };
        })
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.recipe);

      setSuggestedRecipes(matchedRecipes);
    } catch (caughtError) {
      setError(t("pantry.fetchError"));
      console.error(caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pantry-card">
      <h2>{t("pantry.title")}</h2>

      {/* Keep both the wrapper and grid at an explicit height. */}
      <div className="pantry__grid-wrapper">
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            animateRows
            rowHeight={isCompact ? 44 : 48}
            onCellValueChanged={(e) => {
              const updated: PantryItem[] = [];
              e.api.forEachNode((node) => node.data && updated.push(node.data));
              setRowData(updated);
            }}
          />
        </div>
      </div>

      <div className="pantry__footer">
        <button className="pantry__add-btn" onClick={handleAdd}>
          {t("pantry.addIngredient")}
        </button>
        <button
          className="pantry__suggest-btn"
          onClick={handleSuggest}
          disabled={isLoading}
        >
          {isLoading ? t("pantry.suggesting") : t("pantry.suggestRecipes")}
        </button>
      </div>

      <PantryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />

      <div className="pantry__suggestions">
        <h3>{t("pantry.suggestions")}</h3>
        {error ? <p className="muted">{error}</p> : null}
        {!error && suggestedRecipes.length === 0 ? (
          <p className="muted">{t("pantry.noSuggestions")}</p>
        ) : null}
        {suggestedRecipes.length > 0 ? (
          <div className="pantry__recipe-cards">
            {suggestedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  title={getLocalizedRecipeTitle(t, recipe)}
                  subtitle={getLocalizedMealType(t, recipe.mealType)}
                  tags={recipe.tags.map((tag) => getLocalizedDietTag(t, tag))}
                  imageUrl={recipe.imageUrl}
                  onClick={() =>
                    navigate(`/recipes/${recipe.id}`, {
                      state: { recipe, backPage: "home" },
                    })
                  }
                />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// import { AgGridReact } from "ag-grid-react";
// import { useMemo, useState } from "react";
// import { suggestRecipes } from "../../lib/api";

// // ✅ AG Grid styles + theme
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

// // ✅ Module registration (fixar “tom grid” i vissa versioner)
// import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// type PantryItem = {
//   name: string;
//   quantity: number;
//   unit: string;
// };

// export function PantryGrid() {
//   const [rowData, setRowData] = useState<PantryItem[]>([
//     const [suggestions, setSuggestions] = useState<any[]>([]);
//     { name: "eggs", quantity: 6, unit: "pcs" },
//     { name: "flour", quantity: 1, unit: "kg" },
//     { name: "milk", quantity: 1, unit: "l" },
//   ]);

//   const columnDefs = useMemo(
//     () => [
//       { field: "name", headerName: "Ingredient", editable: true, flex: 1 },
//       { field: "quantity", headerName: "Quantity", editable: true, width: 120 },
//       { field: "unit", headerName: "Unit", editable: true, width: 120 },
//     ],
//     [],
//   );

//   return (
//     <div className="card">
//       <h2>Your pantry</h2>

//       {/* Keep both the wrapper and grid at an explicit height. */}
//       <div style={{ height: 320, marginTop: 12 }}>
//         <div
//           className="ag-theme-quartz"
//           style={{ height: "100%", width: "100%" }}
//         >
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={columnDefs as any}
//             animateRows
//             onCellValueChanged={(e) => {
//               const updated: PantryItem[] = [];
//               e.api.forEachNode((node) => node.data && updated.push(node.data));
//               setRowData(updated);
//             }}
//           />
//         </div>
//       </div>

//       <button
//         style={{ marginTop: 12 }}
//         onClick={() => setRowData((prev) => [...prev, { name: "", quantity: 1, unit: "pcs" }])}
//       >
//         Add Ingredient
//       </button>
//     </div>
//   );
// }
