import {Menu, MenuProps} from "antd";
import React from "react";
import { Header } from "antd/es/layout/layout";
import { Link, useNavigate } from "react-router-dom";

const AppHeader = () => {
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: 1,
      label: "Finantsprognoosi koostamine",
      icon: "📊 ",
      onClick: () => navigate("/forecasts"),
    },
    {
      key: 2,
      label: "Ärimudeli ehitamine",
      icon: "📚 ",
      onClick: () => navigate("/model"),
    },
  ]

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
        <Link to="/">
          <h1>Äriplaani koostaja</h1>
        </Link>
      <Menu
        mode="horizontal"
        selectable={false}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      ></Menu>
    </Header>
  );
};

export default AppHeader;
