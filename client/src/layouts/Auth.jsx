import React from "react";
// import store from "../redux/store";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import pagesStyle from "assets/jss/material-dashboard-pro-react/layouts/authStyle.jsx";
import background from "assets/img/login.jpeg";
import LoginPage from "../views/Pages/LoginPage";

class Pages extends React.Component {
  wrapper = React.createRef();
  
  render() {
    const { classes } = this.props;
    return (
      <div>
        {/* <AuthNavbar brandText={this.getActiveRoute(routes)} {...rest} /> */}
        <div className={classes.wrapper} ref={this.wrapper}>
          <div
            className={classes.fullPage}
            style={{ backgroundImage: "url(" + background + ")" }}
          >
            <LoginPage/>
            {/* <Footer white /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(pagesStyle)(Pages);
