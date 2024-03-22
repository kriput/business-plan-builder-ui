import { Link } from "react-router-dom";
import { Button } from "antd";
import React from "react";

const Home = () => {
  return (
    <>
      <br />
      <br />
      <div style={{ textAlign: "center" }}>
        <h1 style={{ textAlign: "center" }}>
          Oled kirjutamas äriplanni ning otsid rakendust finantsprognoosi
          koostamiseks?
        </h1>
        <h3 style={{ color: "green" }}>Oled leidnud!</h3>
        <Link to="/forecasts">
          <Button size="large" type="primary" shape="round">
            Alusta finantsprognoosi koostamisega siin!
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Home;
