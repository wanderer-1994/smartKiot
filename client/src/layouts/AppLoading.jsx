import React from "react";
import { Spin } from "antd";

class AppLoading extends React.Component {
  render() {
    return (
      <div style={{
        height: "100vh",
        backgroundColor: "white",
        paddingTop: "40vh"
      }}>
          <Spin size="large"/>
          <div style={{textAlign: "center", fontSize: 30, fontWeight: "bold"}}>SMART KIOT</div>
      </div>
    );
  }
}

export default AppLoading;
