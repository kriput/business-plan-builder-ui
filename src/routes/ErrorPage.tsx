import { Result } from "antd";
import { useRouteError } from "react-router-dom";
import AppHeader from "../base_components/AppHeader";

const ErrorPage = () => {
  const error: any = useRouteError();
  console.log(error);
  return (
      <>
      <AppHeader/>
    <Result title="Ootamatu viga" status={error.status}>
      <div>
        <h2 style={{ textAlign: "center" }}>
          Error: <i>{error.message || error.statusText}</i>
        </h2>
      </div>
    </Result>
      </>
  );
};

export default ErrorPage;
