import { AgGridReact } from "ag-grid-react";
import { useMemo, useState, useCallback } from "react";

// ✅ AG Grid styles + theme
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// ✅ Module registration (fixar “tom grid” i vissa versioner)
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import type { PantryItem } from "./pantry.types";
import { PantryModal } from "./PantryModal";

export function PantryGrid() {
  const [rowData, setRowData] = useState<PantryItem[]>([
    { id: "1", name: "ägg", quantity: 6, unit: "st" },
    { id: "2", name: "mjöl", quantity: 1, unit: "kg" },
    { id: "3", name: "mjölk", quantity: 1, unit: "l" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | undefined>();

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
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => handleEdit(params.data)}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(params.data.id)}
              style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#ff4444', color: 'white' }}
            >
              Delete
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

  return (
    <div className="pantry-card">
      <h2>Your pantry</h2>

      {/* ✅ Ge både wrapper och grid en tydlig höjd */}
      <div style={{ height: 320, marginTop: 12 }}>
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs as any} // eslint-disable-line @typescript-eslint/no-explicit-any
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
        onClick={handleAdd}
      >
        Add Ingredient
      </button>

      <PantryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
}
