// import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";

import "../imports/startup/accounts-config.js";
// import App from "../imports/ui/App.jsx";
import { renderRoutes } from "../imports/startup/client/routes.js";

import ReactGA from "react-ga";

ReactGA.initialize("UA-138206885-1");

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById("react-root"));
});
