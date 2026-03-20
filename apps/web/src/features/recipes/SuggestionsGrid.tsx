import type { ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { useFavorites } from "../favorites/FavoritesContext";

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
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const columnDefs = useMemo(
    (): ColDef[] => [
      { field: "title", headerName: "Recipe", flex: 2 },
      { field: "source", headerName: "Source", flex: 1 },
      {
        field: "match",
        headerName: "Match %",
        flex: 1,
        valueFormatter: (p: ICellRendererParams) =>
          Math.round((p.value ?? 0) * 100) + "%",
      },
      {
        field: "have",
        headerName: "Have",
        flex: 1,
        valueFormatter: (p: ICellRendererParams) => p.value?.length ?? 0,
      },
      {
        field: "missing",
        headerName: "Missing",
        flex: 1,
        valueFormatter: (p: ICellRendererParams) => p.value?.length ?? 0,
      },
      {
        field: "url",
        headerName: "Link",
        cellRenderer: (p: ICellRendererParams) =>
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
        cellRenderer: (p: ICellRendererParams) => {
          const recipe = p.data as Suggestion;
          const fav = isFavorite(recipe.id);
          return (
            <button
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

// import { AgGridReact } from "ag-grid-react";
// import { useMemo } from "react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

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

// export function SuggestionsGrid({ suggestions }: { suggestions: Suggestion[] }) {
//   const columnDefs = useMemo(
//     () => [
//       { field: "title", headerName: "Recipe", flex: 2 },
//       { field: "source", headerName: "Source", flex: 1 },
//       {
//         field: "match",
//         headerName: "Match %",
//         flex: 1,
//         valueFormatter: (p: any) => Math.round((p.value ?? 0) * 100) + "%",
//       },
//       {
//         field: "have",
//         headerName: "Have",
//         flex: 1,
//         valueFormatter: (p: any) => p.value?.length ?? 0,
//       },
//       {
//         field: "missing",
//         headerName: "Missing",
//         flex: 1,
//         valueFormatter: (p: any) => p.value?.length ?? 0,
//       },
//       {
//         field: "url",
//         headerName: "Link",
//         cellRenderer: (p: any) =>
//           p.value ? (
//             <a href={p.value} target="_blank" rel="noreferrer">
//               View
//             </a>
//           ) : (
//             "-"
//           ),
//       },
//     ],
//     [],
//   );

//   return (
//     <div style={{ height: 400, marginTop: 12 }}>
//       <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
//         <AgGridReact rowData={suggestions} columnDefs={columnDefs as any} />
//       </div>
//     </div>
//   );
// }
