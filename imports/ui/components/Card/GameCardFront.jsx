import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import Card from "../../components/Card/Card.jsx";
const style = {
  imageSquare: {
    position: "relative",
    overflow: "hidden",
    paddingBottom: "100%",
    "& img": {
      position: "absolute",
      maxWidth: "100%",
      maxHeight: "100%",
      top: "50%",
      left: "50%",
      transform: "translateX(-50%) translateY(-50%)"
    }
  }
};

function GameCardFront({ ...props }) {
  const { classes, name } = props;
  return (
    <Card game>
      <div className={classes.imageSquare}>
        <img src={"http://pokestadium.com/sprites/xy/" + name + ".gif"} />
      </div>
    </Card>
  );
}

GameCardFront.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string
};

export default withStyles(style)(GameCardFront);
