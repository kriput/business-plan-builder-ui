import AppHeader from "../base_components/AppHeader";
import AppFooter from "../base_components/AppFooter";
import { Outlet } from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const Root = () => {
  return (
    <>
      <AppHeader />

      <div className="container">
        <main role="main" className="pb-3">
          <QueryClientProvider client={new QueryClient()}>
          <Outlet />
          </QueryClientProvider>
        </main>
      </div>

      <AppFooter />
    </>
  );
};

export default Root;
