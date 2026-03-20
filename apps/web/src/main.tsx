import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { FavoritesProvider } from "./features/favorites/FavoritesContext";
import "./styles/global.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </React.StrictMode>,
);
