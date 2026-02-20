import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";

// ✅ AG Grid styles + theme
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// ✅ Module registration (fixar “tom grid” i vissa versioner)
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

type PantryItem = {
  name: string;
  quantity: number;
  unit: string;
};

export function PantryGrid() {
  const [rowData, setRowData] = useState<PantryItem[]>([
    { name: "ägg", quantity: 6, unit: "st" },
    { name: "mjöl", quantity: 1, unit: "kg" },
    { name: "mjölk", quantity: 1, unit: "l" },
  ]);

  const columnDefs = useMemo(
    () => [
      { field: "name", headerName: "Ingredient", editable: true, flex: 1 },
      { field: "quantity", headerName: "Quantity", editable: true, width: 120 },
      { field: "unit", headerName: "Unit", editable: true, width: 120 },
    ],
    [],
  );

  return (
    <div className="card">
      <h2>Your pantry</h2>

      {/* ✅ Ge både wrapper och grid en tydlig höjd */}
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

      <button
        style={{ marginTop: 12 }}
        onClick={() =>
          setRowData((prev) => [...prev, { name: "", quantity: 1, unit: "st" }])
        }
      >
        Add Ingredient
      </button>
    </div>
  );
}
