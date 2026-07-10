import { createRoot } from "react-dom/client";
import App from "./App";
import * as React from "react";
import { ProjectProvider } from "./contexts/ProjectContext";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </React.StrictMode>
  );
}
