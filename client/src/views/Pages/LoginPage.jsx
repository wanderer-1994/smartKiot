import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import store from "redux/store";
import { getAppInitialState } from "API/general";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      admin_nickname: "",
      admin_pas: "",
      showPas: false,
    };
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  onInputChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }
  onKeyDown = event => {
    if(event.keyCode === 13) this.submitLogin();
  }
  showPas = () => {
    this.setState({showPas: !this.state.showPas});
  }
  submitLogin = () => {
    // console.log(this.state.admin_nickname, this.state.admin_pas);
    let login = {
      admin_nickname: this.state.admin_nickname,
      admin_pas: this.state.admin_pas,
    }
    getAppInitialState(login, (err, data) => {
      let admin = data.admin;
      let products = data.products;
      let appLoading = 0;
      let payload = {admin: admin, products: products, appLoading: appLoading};
      store.dispatch({type: "INITIAL_APP_DATA", payload: payload})
    })
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form>
              <Card login className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="rose"
                >
                  <h4 className={classes.cardTitle}>Đăng nhập</h4>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText="Tên tài khoản..."
                    id="admin_nickname"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.admin_nickname,
                      name: "admin_nickname",
                      onChange: event => this.onInputChange(event),
                      onKeyDown: event => this.onKeyDown(event),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Face className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Mật khẩu"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: this.state.admin_pas,
                      name: "admin_pas",
                      onChange: event => {this.onInputChange(event)},
                      onKeyDown: event => this.onKeyDown(event),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon 
                            onClick={this.showPas}
                            className={classes.inputAdornmentIcon}
                            style={{cursor: "pointer"}}
                          >
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      ),
                      type: (this.state.showPas ? "text" : "password"),
                      autoComplete: "off"
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button
                    onClick={this.submitLogin}
                    color="rose"
                  >
                    Đăng nhập
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(LoginPage);
