import "jquery";
import "popper.js";

import React from "react";
import ReactDOM from "react-dom/client";
import "./site.css";
import Root from "./routes/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import FinancialForecastContainer from "./routes/forecast/container/FinancialForecastContainer";
import FinancialForecastForm from "./routes/forecast/components/FinancialForecastForm";
import FinancialForecastOverview from "./routes/forecast/components/FinancialForecastOverview";
import Home from "./base_components/Home";

export const VAT: number = 0.22;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "forecasts/",
        element: <FinancialForecastOverview />,
      },
      {
        path: "forecasts/add/",
        element: <FinancialForecastForm />,
      },
      {
        path: "forecasts/:id",
        element: <FinancialForecastContainer />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
