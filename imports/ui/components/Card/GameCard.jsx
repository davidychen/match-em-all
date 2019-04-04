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
  blackColor
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
			"linear-gradient(" +
			primaryColor[0] +
			" 50%, " +
			whiteColor +
			" 50%)",
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
  tt() {
    /*<Card className={gameCardClasses} game selected={!this.props.back} onClick={onClick}>
        {back && (
          <div className={classes.cardBack}>
            <div className={classes.cardBackDivider} />
            <div className={classes.cardBackCircle} />
          </div>
        )}
        {!back && (
          <div className={classes.cardFront}>
            <div className={classes.imageSquare}>
              <img
                src={
                  "http://pokestadium.com/sprites/xy/" +
								name +
								".gif"
                }
              />
            </div>
          </div>
        )}
      </Card>*/
  }
  render() {
    const { classes, onClick, back, name } = this.props;
    const gameCardClasses = classNames({
      [classes.back]: this.props.back
    });
    return (
    	<div style={{marginTop:"30px", marginBottom: "30px"}}>
      <ReactCardFlip  isFlipped={this.props.back}>
        <Card
          key="back"
          className={gameCardClasses}
          game
          onClick={onClick}
        >
          <div className={classes.cardBack}>
            <div className={classes.cardBackDivider} />
            <div className={classes.cardBackCircle} />
          </div>
        </Card>
        <Card
          key="front"
          className={gameCardClasses}
          game
          onClick={onClick}
        >
          <div className={classes.cardFront}>
            <div className={classes.imageSquare}>
              <img
                src={
                  "http://pokestadium.com/sprites/xy/" +
									name +
									".gif"
                }
              />
            </div>
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
  onClick: PropTypes.func
};

export default withStyles(style)(GameCard);
