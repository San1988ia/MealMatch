import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import { SuggestionsGrid } from "../recipes/SuggestionsGrid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { suggestRecipes } from "../../lib/api";

type PantryItem = {
  name: string;
  quantity: number;
  unit: string;
};

type Suggestion = {
  id: string;
  title: string;
  image?: string;
  url?: string;
  source?: string;
  match?: number;
  have?: string[];
  missing?: string[];
};

export function PantryGrid() {
  const [rowData, setRowData] = useState<PantryItem[]>([
    { name: "egg", quantity: 6, unit: "pcs" },
    { name: "flour", quantity: 1, unit: "kg" },
    { name: "milk", quantity: 1, unit: "l" },
  ]);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columnDefs = useMemo(
    () => [
      { field: "name", headerName: "Ingredient", editable: true, flex: 1 },
      { field: "quantity", headerName: "Quantity", editable: true, width: 120 },
      { field: "unit", headerName: "Unit", editable: true, width: 120 },
    ],
    [],
  );

  async function handleSuggest() {
    setIsLoading(true);
    setError(null);

    try {
      const ingredients = rowData
        .map((r) => r.name.trim().toLowerCase())
        .filter(Boolean);

      const data = await suggestRecipes(ingredients);
      setSuggestions(data.recipes);
    } catch (e) {
      setError("Could not fetch recipe suggestions.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Your pantry</h2>

      <div style={{ height: 320, marginTop: 12 }}>
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs as any}
            animateRows
            onCellValueChanged={(e) => {
              const updated: PantryItem[] = [];
              e.api.forEachNode((node) => node.data && updated.push(node.data));
              setRowData(updated);
            }}
          />
        </div>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="btn"
          onClick={() =>
            setRowData((prev) => [
              ...prev,
              { name: "", quantity: 1, unit: "pcs" },
            ])
          }
        >
          Add ingredient
        </button>

        <button
          type="button"
          className="btn btn--primary"
          onClick={handleSuggest}
          disabled={isLoading}
        >
          {isLoading ? "Suggesting..." : "Suggest recipes"}
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Suggestions</h3>

        {error ? <p className="muted">{error}</p> : null}

        {!error && suggestions.length === 0 ? (
          <p className="muted">No suggestions yet. Click "Suggest recipes".</p>
        ) : null}

        {suggestions.length > 0 && (
          <SuggestionsGrid suggestions={suggestions} />
        )}
      </div>
    </div>
  );
}

// import { AgGridReact } from "ag-grid-react";
// import { useMemo, useState } from "react";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

// import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// import { suggestRecipes } from "../../lib/api";

// type PantryItem = {
//   name: string;
//   quantity: number;
//   unit: string;
// };

// type Suggestion = {
//   id: string;
//   title: string;
//   image?: string;
//   url?: string;
//   source?: string;
//   match?: number;
//   have?: string[];
//   missing?: string[];
// };

// export function PantryGrid() {
//   // 1) Pantry rows
//   const [rowData, setRowData] = useState<PantryItem[]>([
//     { name: "egg", quantity: 6, unit: "pcs" },
//     { name: "flour", quantity: 1, unit: "kg" },
//     { name: "milk", quantity: 1, unit: "l" },
//   ]);

//   // 2) Suggestions from backend
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // 3) AG Grid columns
//   const columnDefs = useMemo(
//     () => [
//       { field: "name", headerName: "Ingredient", editable: true, flex: 1 },
//       { field: "quantity", headerName: "Quantity", editable: true, width: 120 },
//       { field: "unit", headerName: "Unit", editable: true, width: 120 },
//     ],
//     [],
//   );

//   // 4) Call backend
//   async function handleSuggest() {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const ingredients = rowData
//         .map((r) => r.name.trim().toLowerCase())
//         .filter(Boolean);

//       const data = await suggestRecipes(ingredients);
//       setSuggestions(data.recipes);
//     } catch (e) {
//       setError("Could not fetch recipe suggestions.");
//       console.error(e);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="card">
//       <h2>Your pantry</h2>

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

//       <div className="button-row">
//         <button
//           type="button"
//           className="btn"
//           onClick={() =>
//             setRowData((prev) => [
//               ...prev,
//               { name: "", quantity: 1, unit: "pcs" },
//             ])
//           }
//         >
//           Add ingredient
//         </button>

//         <button
//           type="button"
//           className="btn btn--primary"
//           onClick={handleSuggest}
//           disabled={isLoading}
//         >
//           {isLoading ? "Suggesting..." : "Suggest recipes"}
//         </button>
//       </div>

//       <div style={{ marginTop: 16 }}>
//         <h3>Suggestions</h3>

//         {error ? <p className="muted">{error}</p> : null}

//         {!error && suggestions.length === 0 ? (
//           <p className="muted">No suggestions yet. Click “Suggest recipes”.</p>
//         ) : null}

//         <div style={{ marginTop: 16 }}>
//           <h3>Suggestions</h3>

//           {!error ? <p className="muted">{error}</p> : null}

//           {!error && suggestions.length === 0 ? (
//             <p className="muted">
//               No suggestions yet. Click “Suggest recipes”.
//             </p>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

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
