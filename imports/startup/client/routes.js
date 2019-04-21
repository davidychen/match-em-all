import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
// import ReactDOM from "react-dom";
import createHistory from "history/createBrowserHistory";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import PublicLayout from "../../ui/layouts/Public.jsx";
import AdminLayout from "../../ui/layouts/Admin.jsx";

import "../../ui/assets/scss/material-dashboard-pro-react.scss";

import ReactGA from "react-ga";

const hist = createHistory();
hist.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
  // console.log("changed");
});

function ProtectedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Meteor.user() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login-page",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

ProtectedRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.object
};

class AppRoutes extends Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    console.log("mounted");
  }

  render() {
    return (
      <Router history={hist}>
        <Switch>
          <ProtectedRoute path="/admin" component={AdminLayout} />
          <Route path="/" component={PublicLayout} />
          {/*<Redirect exact from="/" to="/public/landing-page" />*/}
          <Redirect from="*" to="/error-page" />
        </Switch>
      </Router>
    );
  }
}

export const renderRoutes = () => <AppRoutes />;
