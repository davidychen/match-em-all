import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

import {
  grayColor,
  hexToRgb
} from "../../assets/jss/material-dashboard-pro-react.jsx";

const style = {
  grid: {
    margin: "0 -15px",
    width: "calc(100% + 30px)"
    // '&:before,&:after':{
    //   display: 'table',
    //   content: '" "',
    // },
    // '&:after':{
    //   clear: 'both',
    // }
  },
  landingLine: {
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, " +
      "rgba(0,0,0,0) calc(0% + 39.2px), " +
      "rgba(" +
      hexToRgb(grayColor[6]) +
      ",1) calc(0% + 40px), " +
      "rgba(" +
      hexToRgb(grayColor[6]) +
      ",1) calc(0% + 85px), " +
      "rgba(0,0,0,0) calc(0% + 85.8px), " +
      "rgba(0,0,0,0) 100%)"
  },
  landingTitle: {
    background: "linear-gradient(to right, #ee1515, #EF4144)",
    padding: "20px",
    marginBottom: "20px"
  }
};

function GridContainer({ ...props }) {
  const {
    classes,
    children,
    className,
    landing,
    landingTitle,
    ...rest
  } = props;
  return (
    <Grid
      container
      {...rest}
      className={
        classes.grid +
        " " +
        className +
        (landing ? " " + classes.landingLine : "") +
        (landingTitle ? " " + classes.landingTitle : "")
      }
    >
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  classes: PropTypes.any,
  children: PropTypes.any,
  className: PropTypes.any,
  landing: PropTypes.any,
  landingTitle: PropTypes.any
};

export default withStyles(style)(GridContainer);
