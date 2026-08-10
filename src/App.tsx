import * as React from "react";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import ArtDetail from "./pages/ArtDetail";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import BusinessDevelopmentDigest from "./pages/BusinessDevelopmentDigest";
import AiPatterns from "./pages/AiPatterns";
import IBMQuantum from "./pages/IBMQuantum"

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <ProjectsPage /> },
      { path: "/bddigest", element: <BusinessDevelopmentDigest />},
      { path: "/aipatterns", element: <AiPatterns /> },
      { path: "/ibmquantum", element: <IBMQuantum />},
      { path: "/art/:id", element: <ArtDetail /> },
      { path: "/about", element: <About /> },

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
