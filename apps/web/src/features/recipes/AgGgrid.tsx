import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";

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

export function SuggestionsGrid({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  const columnDefs = useMemo(
    () => [
      { field: "title", headerName: "Recipe", flex: 2 },
      { field: "source", headerName: "Source", flex: 1 },
      {
        field: "match",
        headerName: "Match %",
        flex: 1,
        valueFormatter: (p: any) => Math.round((p.value ?? 0) * 100) + "%",
      },
      {
        field: "have",
        headerName: "Have",
        flex: 1,
        valueFormatter: (p: any) => p.value?.length ?? 0,
      },
      {
        field: "missing",
        headerName: "Missing",
        flex: 1,
        valueFormatter: (p: any) => p.value?.length ?? 0,
      },
      {
        field: "url",
        headerName: "Link",
        cellRenderer: (p: any) =>
          p.value ? (
            <a href={p.value} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            "-"
          ),
      },
    ],
    [],
  );

  return (
    <div style={{ height: 400, marginTop: 12 }}>
      <div
        className="ag-theme-quartz"
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact rowData={suggestions} columnDefs={columnDefs as any} />
      </div>
    </div>
  );
}
