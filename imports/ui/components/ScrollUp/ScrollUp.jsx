import React from "react";
// nodejs library that concatenates classes
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ArrowUpward from "@material-ui/icons/ArrowUpward";

import Button from "../../components/CustomButtons/Button.jsx";

// @material-ui/icons
import { warningColor } from "../../assets/jss/material-dashboard-pro-react.jsx";

const style = () => ({
  scroll: {
    opacity: "1",
    background:
      "linear-gradient(60deg," + warningColor[1] + "," + warningColor[4] + ")",
    width: "40px",
    height: "40px",
    overflow: "auto",
    position: "sticky",
    /*position: "fixed",*/
    /*bottom: "10px",*/
    right: "10px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      opacity: "1"
    }
  },
  marginRight: {
    marginRight: "5px",
    position: "absolute",
    bottom: "5px",
    right: "5px"
  },
  icons: {
    width: "17px",
    height: "17px"
  }
});

class ScrollUp extends React.Component {
  constructor() {
    super();

    this.state = {
      intervalId: 0,
      isvisible: false,
      shouldvisible: false,
      opacity: 0
    };
    this.setting = {
      startline: 100,
      scrollto: 0,
      scrollduration: 1000,
      fadeduration: [500, 100]
    };
    this.controlattrs = { offsetx: 5, offsety: 5 };
  }

  /*scrollStep() {
    if (this.props.scrollTop === 0) {
      clearInterval(this.state.intervalId);
    }
    console.log(this.props.scrollTop, this.props.scrollStepInPx);
    this.props.scrollFunc(0, this.props.scrollTop - this.props.scrollStepInPx);
  }*/

  scrollToTop() {
    /*let intervalId = setInterval(
      this.scrollStep.bind(this),
      this.props.delayInMs
    );
    this.setState({ intervalId: intervalId });*/
    this.props.headerRef.scrollIntoView({
      behavior: "smooth"
    });
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    // console.log("BUTTON:", this.props.scrollTop);
    return (
      <Button
        justIcon
        round
        color="warning"
        className={classes.marginRight}
        onClick={() => {
          this.scrollToTop();
        }}
      >
        <ArrowUpward className={classes.icons} />
      </Button>
    );
  }
}

ScrollUp.propTypes = {
  classes: PropTypes.object.isRequired,
  scrollStepInPx: PropTypes.number,
  delayInMs: PropTypes.number,
  scrollTop: PropTypes.number,
  headerRef: PropTypes.object
};

export default withStyles(style)(ScrollUp);
