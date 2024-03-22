import { Footer } from "antd/es/layout/layout";
import React from "react";

const AppFooter = () => {
  return <Footer className='footer' style={{ textAlign: 'center' }}>
    Ant Design ©{new Date().getFullYear()} Created by Ant UED
  </Footer>
};

export default AppFooter;
