import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { NavLink, Link, withRouter } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Menu from "@material-ui/icons/Menu";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Fingerprint from "@material-ui/icons/Fingerprint";
import LockOpen from "@material-ui/icons/LockOpen";
import VideogameAsset from "@material-ui/icons/VideogameAsset";

// core components
import Button from "../../components/CustomButtons/Button";

import authNavbarStyle from "../../assets/jss/material-dashboard-pro-react/components/authNavbarStyle.jsx";

class AuthNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.logout = this.logout.bind(this);
  }
  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.setState({ open: false });
    }
  }
  logout(e) {
    e.preventDefault();
    Meteor.logout(err => {
      if (err) {
        console.log(err.reason);
      } else {
        this.props.history.push("/login-page");
      }
    });
  }
  render() {
    const { classes, color, brandText } = this.props;
    const appBarClasses = cx({
      [" " + classes[color]]: color
    });
    var list = (
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <NavLink
            to={"/"}
            className={cx(classes.navLink, {
              [classes.navLinkActive]: this.activeRoute("/")
            })}
          >
            <Dashboard className={classes.listItemIcon} />
            <ListItemText
              primary={"Home"}
              disableTypography={true}
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>
        {!this.props.loggedIn && (
          <ListItem className={classes.listItem}>
            <NavLink
              to={"/register-page"}
              className={cx(classes.navLink, {
                [classes.navLinkActive]: this.activeRoute("/register-page")
              })}
            >
              <PersonAdd className={classes.listItemIcon} />
              <ListItemText
                primary={"Register"}
                disableTypography={true}
                className={classes.listItemText}
              />
            </NavLink>
          </ListItem>
        )}
        {!this.props.loggedIn && (
          <ListItem className={classes.listItem}>
            <NavLink
              to={"/login-page"}
              className={cx(classes.navLink, {
                [classes.navLinkActive]: this.activeRoute("/login-page")
              })}
            >
              <Fingerprint className={classes.listItemIcon} />
              <ListItemText
                primary={"Login"}
                disableTypography={true}
                className={classes.listItemText}
              />
            </NavLink>
          </ListItem>
        )}
        {this.props.loggedIn && (
          <ListItem className={classes.listItem}>
            <NavLink
              to={"/admin/game"}
              className={cx(classes.navLink, {
                [classes.navLinkActive]: this.activeRoute("/admin/game")
              })}
            >
              <VideogameAsset className={classes.listItemIcon} />
              <ListItemText
                primary={"Game"}
                disableTypography={true}
                className={classes.listItemText}
              />
            </NavLink>
          </ListItem>
        )}
        {this.props.loggedIn && (
          <ListItem className={classes.listItem}>
            <a onClick={this.logout} className={classes.navLink} style={{cursor: "pointer"}}>
              <LockOpen className={classes.listItemIcon} />
              <ListItemText
                primary={"Logout"}
                disableTypography={true}
                className={classes.listItemText}
              />
            </a>
          </ListItem>
        )}
      </List>
    );
    return (
      <AppBar position="static" className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <Hidden smDown>
            <div className={classes.flex}>
              <Link to="/">
                <Button className={classes.title} color="transparent">
                  {brandText}
                </Button>
              </Link>
            </div>
          </Hidden>
          <Hidden mdUp>
            <div className={classes.flex}>
              <Link to="/">
                <Button className={classes.title} color="transparent">
                  <h1>Match &apos;Em All</h1>
                </Button>
              </Link>
            </div>
          </Hidden>
          <Hidden smDown>{list}</Hidden>
          <Hidden mdUp>
            <Button
              className={classes.sidebarButton}
              color="transparent"
              justIcon
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
            >
              <Menu />
            </Button>
          </Hidden>
          <Hidden mdUp>
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor={"right"}
                open={this.state.open}
                classes={{
                  paper: classes.drawerPaper
                }}
                onClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
              >
                {list}
              </Drawer>
            </Hidden>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

AuthNavbar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string,
  location: PropTypes.object,
  user: PropTypes.object,
  loggedIn: PropTypes.bool,
  history: PropTypes.object
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
  })(withStyles(authNavbarStyle)(AuthNavbar))
);
