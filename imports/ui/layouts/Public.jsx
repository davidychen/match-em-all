import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, withRouter } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import AuthNavbar from "../components/Navbars/AuthNavbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

import routes from "../dash-routes.js";

import pagesStyle from "../assets/jss/material-dashboard-pro-react/layouts/publicStyle.jsx";

/*import register from "../../assets/img/register.jpeg";
import login from "../../assets/img/login.jpeg";
import lock from "../../assets/img/lock.jpeg";
import error from "../../assets/img/clint-mckoy.jpg";
import pricing from "../../assets/img/bg-pricing.jpeg";*/

class Pages extends React.Component {
  constructor() {
    super();
    this.wrapperRef;
  }
  componentDidMount() {
    document.body.style.overflow = "unset";
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/public") {
        return (
          <Route
            exact path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  /*getBgImage = () => {
    if (window.location.pathname.indexOf("/auth/register-page") !== -1) {
      return register;
    } else if (window.location.pathname.indexOf("/auth/login-page") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/pricing-page") !== -1) {
      return pricing;
    } else if (
      window.location.pathname.indexOf("/auth/lock-screen-page") !== -1
    ) {
      return lock;
    } else if (window.location.pathname.indexOf("/auth/error-page") !== -1) {
      return error;
    }
  };*/
  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(
            routes[i].layout +  routes[i].path
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  render() {
    const { classes, ...rest } = this.props;
    let wrapperRefFunc = el => (this.wrapperRef = el);
    return (
      <div>
        <AuthNavbar brandText={this.getActiveRoute(routes)} {...rest} />
        <div className={classes.wrapper} ref={wrapperRefFunc}>
          <div
            className={classes.fullPage}
            // style={{ backgroundImage: "url(" + this.getBgImage() + ")" }}
          >
            <Switch>{this.getRoutes(routes)}</Switch>
            <Footer white />
          </div>
        </div>
      </div>
    );
  }
}

Pages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(
  withTracker(() => {
    const user = Meteor.user();
    const userDataAvailable = user !== undefined;
    const loggedIn = user && userDataAvailable;
    return {
      user: user,
      loggedIn: loggedIn
    };
  })(withStyles(pagesStyle)(Pages))
);
