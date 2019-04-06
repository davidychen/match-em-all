import React from "react";
import PropTypes from "prop-types";
import { NavLink, Link, withRouter, Redirect } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
import Face from "@material-ui/icons/Face";
// import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import Snackbar from "../../components/Snackbar/Snackbar.jsx";

import loginPageStyle from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      error: "",
      errorVisible: false,
      redirectToReferrer: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    if (this.props.location.state) {
      if (this.props.location.state.from.pathname != "/public/login-page") {
        this.setState({
          error: "You need to log in to view the content. ",
          errorVisible: true
        });
        clearTimeout(this.errorTimeOutFunction);
        this.errorTimeOutFunction = setTimeout(
          function() {
            this.setState({ error: "", errorVisible: false });
          }.bind(this),
          6000
        );
      }
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
    clearTimeout(this.errorTimeOutFunction);
    this.errorTimeOutFunction = null;
  }
  handleSubmit(e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    Meteor.loginWithPassword({username: username}, password, err => {
      if (err) {
        this.setState({
          error: err.reason,
          errorVisible: true
        });
        clearTimeout(this.errorTimeOutFunction);
        this.errorTimeOutFunction = setTimeout(
          function() {
            this.setState({ error: "", errorVisible: false });
          }.bind(this),
          6000
        );
      } else {
        this.setState({ redirectToReferrer: true });
        // this.props.history.push("/");
      }
    });
  }

  render() {
    const { classes } = this.props;
    const error = this.state.error;
    let fromRoute = this.props.location.state || { pathname: "/admin/game" };

    let redirectToReferrer = this.state.redirectToReferrer;
    if (this.props.loggedIn || redirectToReferrer) {
      return <Redirect to={fromRoute} />;
    }
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form>
              <Card login className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="primary"
                >
                  <h4 className={classes.cardTitle}>Log in</h4>
                </CardHeader>
                <CardBody>
                  <Snackbar
                    place="tc"
                    color="danger"
                    icon={AddAlert}
                    message={"ERROR - " + error}
                    open={this.state.errorVisible}
                    closeNotification={() =>
                      this.setState({ errorVisible: false })
                    }
                    close
                  />
                  <CustomInput
                    labelText="User Name.."
                    id="username"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Face className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      ),
                      type: "password"
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button
                    color="primary"
                    round
                    size="lg"
                    block
                    onClick={this.handleSubmit}
                  >
                    Let&apos;s Go
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
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  loggedIn: PropTypes.bool
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
  })(withStyles(loginPageStyle)(LoginPage))
);
