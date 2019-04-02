import React from "react";
// import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import PublicLayout from "../../ui/layouts/Public.jsx";
// import AdminLayout from "../../ui/layouts/Admin.jsx";

import "../../ui/assets/scss/material-dashboard-pro-react.scss";

const hist = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={hist}>
    <Switch>
      <Route exact path="/" component={PublicLayout} />
      {/*<Route path="/auth" component={AuthLayout} />
      <Route path="/admin" component={AdminLayout} />
      <Redirect from="/" to="/admin/dashboard" />*/}
    </Switch>
  </Router>
);
