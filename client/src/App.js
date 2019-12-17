import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import store from "./redux/store";
import { connect } from "react-redux";
import AuthLayout from "layouts/Auth.jsx";
import AdminLayout from "layouts/Admin.jsx";
import AppLoading from "./layouts/AppLoading";
import { getAppInitialState } from "./API/general";

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            appLoading: this.props.appLoading,
            admin: {...this.props.admin},
        }
    }
    componentDidMount = () => {
        store.subscribe(() => {
            let appLoading = store.getState().appLoading;
            let admin = store.getState().admin;
            if(appLoading !== this.state.appLoading || admin.admin_id !== this.state.admin.admin_id)
                this.setState({appLoading: appLoading, admin: admin});
        });

        getAppInitialState({}, (err, data) => {
            let admin = data.admin;
            let products = data.products;
            let appLoading = 0;
            let payload = {admin: admin, products: products, appLoading: appLoading};
            this.props.dispatch({type: "INITIAL_APP_DATA", payload: payload})
        })
    }

    render = () => {
        return (
            this.state.appLoading === 1 ?
            (
                <AppLoading/>
            ) : (
                this.state.admin.admin_id ? (
                    <Switch>
                        <Route path="/" component={AdminLayout} />
                    </Switch>
                ) : (
                    <Switch>
                        <Route exact path="/" component={AuthLayout} />
                        <Redirect to="/" />
                    </Switch>
                )
            )
        )
    }
}

function mapStateToProps(state){
    return {
        appLoading: state.appLoading,
        admin: state.admin,
    }
}

export default connect(mapStateToProps)(App);
