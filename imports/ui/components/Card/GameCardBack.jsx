import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import {
  grayColor,
  whiteColor,
  primaryColor
} from "../../assets/jss/material-dashboard-pro-react.jsx";

// core components
import Card from "../../components/Card/Card.jsx";
const style = theme => ({
  cardBack: {
    position: "relative",
    overflow: "hidden",
    paddingBottom: "100%",
    background:
      "linear-gradient(" + primaryColor[0] + " 50%, " + whiteColor + " 50%)",
    borderRadius: "30px",
    display: "flex",
    "&:hover $cardBackDivider": {
      height: "2.4rem"
    }
  },
  cardBackDivider: {
    height: "1.4rem",
    width: "100%",
    backgroundColor: grayColor[6],
    transition: "width 0.3s 0.1s ease, height 0.3s 0.3s ease",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  cardBackCircle: {
    width: "50%",
    height: "50%",
    borderRadius: "2000rem",
    border: "0.6rem solid " + grayColor[6],
    backgroundColor: whiteColor,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.3s ease",
  }
});

function GameCardBack({ ...props }) {
  const { classes } = props;
  return (
    <Card game back>
      <div className={classes.cardBack}>
        <div className={classes.cardBackDivider} />
        <div className={classes.cardBackCircle} />
      </div>
    </Card>
  );
}

GameCardBack.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(GameCardBack);
