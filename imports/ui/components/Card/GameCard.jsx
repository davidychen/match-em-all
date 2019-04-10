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
const style = theme => ({
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
    borderRadius: "50%",
    display: "flex",
    "&:hover, &:focus": {
      transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
      cursor: "pointer",
      boxShadow:
        "0 16px 38px -12px rgba(" +
        hexToRgb(blackColor) +
        ", 0.56), 0 4px 25px 0px rgba(" +
        hexToRgb(blackColor) +
        ", 0.12), 0 8px 10px -5px rgba(" +
        hexToRgb(blackColor) +
        ", 0.2)",
      "& $cardBackDivider": {
        height: "25%"
      }
    }
    /*"&:hover, &:focus": {
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
    }*/
  },
  cardBackDivider: {
    height: "10%",
    width: "120%",
    backgroundColor: grayColor[6],
    transition: "width 0.3s 0.1s ease, height 0.3s 0.3s ease",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  cardBackCircle: {
    width: "40%",
    height: "40%",
    borderRadius: "2000rem",
    border: "1vw solid " + grayColor[6],
    /* [theme.breakpoints.down("sm")]: {
      border: "2vw solid " + grayColor[6]
    },*/
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
    paddingBottom: "100%"
  },
  sprite: {
    position: "absolute",
    top: "50%",
    left: "50%",
    maxWidth: "100%",
    maxHeight: "100%",
    transform: "translateX(-50%) translateY(-50%)",
    overflow: "auto"
  },
  star: {
    position: "absolute",
    width: "20%",
    height: "20%",
    top: "10%",
    right: "10%",
    /*overflow: "auto",*/
    zIndex: "3",
    "& img": {
      maxWidth: "100%",
      maxHeight: "100%"
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
  constructor(props) {
    super(props);
    this.back;
    this.loaded = false;

    this.state = {
      prevBack: this.props.back,
      prevLink: this.getLink(this.props.name)
    };
  }
  getLink(name) {
    let tempName = name;
    switch (name) {
      case "nidoran-m":
        tempName = "nidoranm";
        break;
      case "nidoran-f":
        tempName = "nidoranf";
        break;
    }
    const imgLink = name
      ? "http://pokestadium.com/sprites/xy/" + tempName + ".gif"
      : "/loader.gif";

    return imgLink;
  }

  updateState() {
    clearTimeout(this.timer);
    if (this.state.prevBack !== this.props.back) {
      if (this.props.back) {
        this.timer = setTimeout(() => {
          this.setState({
            prevBack: this.props.back,
            prevLink: this.getLink(this.props.name)
          });
        }, 1000);
      } else {
        this.setState({
          prevBack: this.props.back,
          prevLink: this.getLink(this.props.name)
        });
      }
    }
  }

  componentDidMount() {
    this.updateState();
  }
  componentDidUpdate() {
    this.updateState();
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const {
      classes,
      idx,
      onClick,
      back,
      name,
      selected,
      matched,
      matchedOwn,
      star
    } = this.props;
    const gameCardFrontClasses = classNames({
      [classes.cardFront]: true,
      [classes.cardSelected]: selected,
      [classes.cardMatched]: matched,
      [classes.cardMatchedOwn]: matchedOwn
    });

    const imgLink =
      !this.state.prevBack && back ? this.state.prevLink : this.getLink(name);

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
              <img
                className={classes.sprite}
                src={imgLink}
                alt={name ? name : "guess " + idx}
              />
              {star && (
                <div className={classes.star}>
                  <img src={"/star3.png"} alt={"star " + idx} />
                </div>
              )}
            </div>
          </Card>
        </ReactCardFlip>
      </div>
    );
  }
}

GameCard.propTypes = {
  classes: PropTypes.object.isRequired,
  idx: PropTypes.number,
  back: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  matched: PropTypes.bool,
  matchedOwn: PropTypes.bool,
  star: PropTypes.bool
};

export default withStyles(style)(GameCard);
