import { AgGridReact } from "ag-grid-react";
import { useMemo, useState, useCallback } from "react";
import { suggestRecipes } from "../../lib/api";
import { SuggestionsGrid } from "../recipes/components/SuggestionsGrid";
import type { Suggestion } from "../recipes/types/suggestion.types";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import type { PantryItem } from "./pantry.types";
import { PantryModal } from "./PantryModal";
import "./PantryGrid.scss";

export function PantryGrid() {
  const [rowData, setRowData] = useState<PantryItem[]>([
    { id: "1", name: "ägg", quantity: 6, unit: "st" },
    { id: "2", name: "mjöl", quantity: 1, unit: "kg" },
    { id: "3", name: "mjölk", quantity: 1, unit: "l" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | undefined>();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = useCallback((item: PantryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setRowData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const columnDefs = useMemo(
    () => [
      { field: "name", headerName: "Ingredient", editable: true, flex: 1 },
      { field: "quantity", headerName: "Quantity", editable: true, width: 120 },
      { field: "unit", headerName: "Unit", editable: true, width: 120 },
      {
        headerName: "Actions",
        width: 120,
        cellRenderer: (params: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
          <div className="pantry__cell-actions">
            <button
              className="pantry__cell-btn pantry__cell-btn--edit"
              onClick={() => handleEdit(params.data)}
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </button>
            <button
              className="pantry__cell-btn pantry__cell-btn--delete"
              onClick={() => handleDelete(params.data.id)}
              title="Delete"
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
    [handleEdit, handleDelete],
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
        setError(
          "Please add at least one valid ingredient with quantity and unit.",
        );
        setSuggestions([]);
        return;
      }

      const data = await suggestRecipes(pantry);
      setSuggestions(data.recipes);
    } catch (caughtError) {
      setError("Could not fetch recipe suggestions.");
      console.error(caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pantry-card">
      <h2>Your pantry</h2>

      {/* ✅ Ge både wrapper och grid en tydlig höjd */}
      <div className="pantry__grid-wrapper">
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            animateRows
            rowHeight={48}
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
          Add Ingredient
        </button>
        <button
          className="pantry__suggest-btn"
          onClick={handleSuggest}
          disabled={isLoading}
        >
          {isLoading ? "Suggesting..." : "Suggest recipes"}
        </button>
      </div>

      <PantryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />

      <div className="pantry__suggestions">
        <h3>Suggestions</h3>
        {error ? <p className="muted">{error}</p> : null}
        {!error && suggestions.length === 0 ? (
          <p className="muted">No suggestions yet. Click "Suggest recipes".</p>
        ) : null}
        {suggestions.length > 0 ? (
          <SuggestionsGrid suggestions={suggestions} />
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
//     { name: "ägg", quantity: 6, unit: "st" },
//     { name: "mjöl", quantity: 1, unit: "kg" },
//     { name: "mjölk", quantity: 1, unit: "l" },
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

//       {/* ✅ Ge både wrapper och grid en tydlig höjd */}
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
//         onClick={() =>
//           setRowData((prev) => [...prev, { name: "", quantity: 1, unit: "st" }])
//         }
//       >
//         Add Ingredient
//       </button>
//     </div>
//   );
// }
