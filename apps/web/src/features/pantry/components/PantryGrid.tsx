import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import { SuggestionsGrid } from "../../recipes/components/SuggestionsGrid";
import type { Suggestion } from "../../recipes/types/suggestion.types";
import type { PantryItem } from "../types/pantry.types";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import {
  ClientSideRowModelModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { suggestRecipes } from "../../../lib/api";

export function PantryGrid() {
  const [rowData, setRowData] = useState<PantryItem[]>([
    { name: "egg", quantity: 6, unit: "pcs" },
    { name: "flour", quantity: 1, unit: "kg" },
    { name: "milk", quantity: 1, unit: "l" },
  ]);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columnDefs = useMemo<ColDef<PantryItem>[]>(
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
            columnDefs={columnDefs}
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
