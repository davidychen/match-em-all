import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ReactCardFlip from "react-card-flip";
// @material-ui/icons
import {
  grayColor,
  whiteColor,
  primaryColor,
  hexToRgb,
  blackColor,
  selectColor,
  dangerColor,
  infoColor
} from "../../assets/jss/material-dashboard-pro-react.jsx";

// core components
import Card from "../../components/Card/Card.jsx";
const style = () => ({
  cardFront: {
    //transform: "rotateY(180deg)",
    //backfaceVisibility: "visible",
  },
  cardBack: {
    //zIndex: "2",
    //backfaceVisibility: "hidden",
    position: "relative",
    overflow: "hidden",
    paddingBottom: "100%",
    background:
      "linear-gradient(" + primaryColor[0] + " 50%, " + whiteColor + " 50%)",
    borderRadius: "30px",
    display: "flex",
    "&:hover $cardBackDivider": {
      height: "2.4rem"
    },
    "&:hover": {
      transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
      cursor: "pointer",
      boxShadow:
        "0 16px 38px -12px rgba(" +
        hexToRgb(blackColor) +
        ", 0.56), 0 4px 25px 0px rgba(" +
        hexToRgb(blackColor) +
        ", 0.12), 0 8px 10px -5px rgba(" +
        hexToRgb(blackColor) +
        ", 0.2)"
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
    transition: "all 0.3s ease"
  },
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
  },
  cardMatch: {
    opacity: "0",
    transition: "all 250ms linear"
  },
  cardSelected: {
    transition: "all 0.3s ease 0.4s",
    boxShadow:
      "0 0 5px 10px " +
      infoColor[7] +
      ", 0 16px 38px -12px rgba(" +
      hexToRgb(blackColor) +
      ", 0.56), 0 4px 25px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 8px 10px -5px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)"
  },
  cardMatched: {
    transition: "all 0.3s ease 0.4s",
    boxShadow:
      "0 0 5px 10px " +
      dangerColor[0] +
      ", 0 16px 38px -12px rgba(" +
      hexToRgb(blackColor) +
      ", 0.56), 0 4px 25px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 8px 10px -5px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)"
  },
  cardMatchedOwn: {
    transition: "all 0.3s ease 0.4s",
    boxShadow:
      "0 0 5px 10px " +
      selectColor +
      ", 0 16px 38px -12px rgba(" +
      hexToRgb(blackColor) +
      ", 0.56), 0 4px 25px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 8px 10px -5px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)"
  }
});

class GameCard extends React.Component {
  constructor() {
    super();
    this.back;
    this.loaded = false;
  }
  compare() {
    if (!this.loaded) {
      this.back = this.props.back;
      this.loaded = true;
    } else {
      this.back = this.props.back;
      this.selected = true;
    }
  }
  componentDidMount() {
    if (this.props.back) {
      this.imgLink = "/question-mark.png";
    }
  }
  render() {
    const { classes, onClick, back, name, selected, matched, matchedOwn } = this.props;
    const gameCardFrontClasses = classNames({
      [classes.cardFront]: true,
      [classes.cardSelected]: selected,
      [classes.cardMatched]: matched,
      [classes.cardMatchedOwn]: matchedOwn,
    });
    let tempName = name;
    switch (name) {
    case "nidoran-m":
      tempName = "nidoranm";
      break;
    case "nidoran-f":
      tempName = "nidoranf";
      break;
    }
    this.imgLink = tempName ? ("http://pokestadium.com/sprites/xy/" + tempName + ".gif") : "/question-mark.png";
    return (
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
        <ReactCardFlip isFlipped={back}>
          <Card key="back" game className={classes.cardBack} onClick={onClick}>
            <div className={classes.cardBackDivider} />
            <div className={classes.cardBackCircle} />
          </Card>
          <Card
            key="front"
            game
            className={gameCardFrontClasses}
            onClick={onClick}
          >
            <div className={classes.imageSquare}>
              <img src={this.imgLink} />
            </div>
          </Card>
        </ReactCardFlip>
      </div>
    );
  }
}

GameCard.propTypes = {
  classes: PropTypes.object.isRequired,
  back: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  matched: PropTypes.bool,
  matchedOwn: PropTypes.bool
};

export default withStyles(style)(GameCard);
