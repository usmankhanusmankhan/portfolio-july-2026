import * as React from "react";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import ReachOutPanel from "./pages/ReachOutPanel";
import ArtDetail from "./pages/ArtDetail";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import BusinessDevelopmentDigest from "./pages/BusinessDevelopmentDigest";

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
      { path: "/reachoutpanel", element: <ReachOutPanel /> },
      { path: "/bddigest", element: <BusinessDevelopmentDigest />},
      { path: "/art/:id", element: <ArtDetail /> },
      { path: "/about", element: <About /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
