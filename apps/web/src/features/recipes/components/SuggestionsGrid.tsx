import type {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { useFavorites } from "../../favorites/context/useFavorites";
import type { Suggestion } from "../types/suggestion.types";

export function SuggestionsGrid({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const columnDefs = useMemo<ColDef<Suggestion>[]>(
    () => [
      { field: "title", headerName: "Recipe", flex: 2 },
      { field: "source", headerName: "Source", flex: 1 },
      {
        field: "match",
        headerName: "Match %",
        flex: 1,
        valueFormatter: (p: ValueFormatterParams<Suggestion>) =>
          Math.round((p.value ?? 0) * 100) + "%",
      },

      {
        field: "status",
        headerName: "Status",
        flex: 1.2,
        valueFormatter: (p: ValueFormatterParams<Suggestion>) => {
          if (p.value === "can-make-now") return "Can make now";
          if (p.value === "missing-few") return "Missing 1–2";
          if (p.value === "missing-many") return "Missing several";
          return "-";
        },
      },

      {
        field: "have",
        headerName: "Have",
        flex: 1,
        valueFormatter: (p: ValueFormatterParams<Suggestion>) =>
          p.value?.length ?? 0,
      },
      {
        field: "missing",
        headerName: "Missing",
        flex: 1,
        valueFormatter: (p: ValueFormatterParams<Suggestion>) =>
          p.value?.length ?? 0,
      },
      {
        field: "url",
        headerName: "Link",
        cellRenderer: (p: ICellRendererParams<Suggestion>) =>
          p.value ? (
            <a href={p.value} target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            "-"
          ),
      },

      {
        headerName: "Favorite",
        cellRenderer: (p: ICellRendererParams<Suggestion>) => {
          const recipe = p.data;
          if (!recipe) return null;

          const fav = isFavorite(recipe.id);
          return (
            <button
              type="button"
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              onClick={() => {
                if (fav) {
                  removeFavorite(recipe.id);
                } else {
                  addFavorite({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    url: recipe.url,
                    source: recipe.source,
                  });
                }
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {fav ? "❤️" : "🤍"}
            </button>
          );
        },
      },
    ],
    [isFavorite, addFavorite, removeFavorite],
  );

  return (
    <div style={{ height: 400, marginTop: 12 }}>
      <div
        className="ag-theme-quartz"
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact rowData={suggestions} columnDefs={columnDefs} />
      </div>
    </div>
  );
}
