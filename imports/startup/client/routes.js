import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
// import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import PublicLayout from "../../ui/layouts/Public.jsx";
import AdminLayout from "../../ui/layouts/Admin.jsx";

import "../../ui/assets/scss/material-dashboard-pro-react.scss";

const hist = createBrowserHistory();

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
              pathname: "/public/login-page",
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

export const renderRoutes = () => (
  <Router history={hist}>
    <Switch>
      <Route path="/public" component={PublicLayout} />
      <ProtectedRoute path="/admin" component={AdminLayout} />
      <Redirect exact from="/" to="/public/landing-page" />
      <Redirect from="*" to="/public/error-page" />
    </Switch>
  </Router>
);
