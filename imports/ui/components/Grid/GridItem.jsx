import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

const style = theme => ({
  grid: {
    padding: "0 15px !important"
  },
  gridGame: {
    [theme.breakpoints.down("xs")]: {
      padding: "0 10px !important"
    }
  }
});

function GridItem({ ...props }) {
  const { classes, children, className, game, ...rest } = props;
  const gridClasses = classNames({
    [classes.grid]: true,
    [classes.gridGame]: game
  });
  return (
    <Grid item {...rest} className={gridClasses + " " + className}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(GridItem);
