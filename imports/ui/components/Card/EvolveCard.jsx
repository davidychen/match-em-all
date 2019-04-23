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
  selectColor
  // dangerColor,
  // infoColor
} from "../../assets/jss/material-dashboard-pro-react.jsx";

// core components
import Card from "../../components/Card/Card.jsx";
const style = () => ({
  cardFront: {
    //transform: "rotateY(180deg)",
    //backfaceVisibility: "visible",
    "&:hover, &:focus": {
      transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
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
  cardPngBack: {
    overflow: "hidden"
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
    display: "flex"
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
  cardEvolved: {
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

class EvolveCard extends React.Component {
  constructor(props) {
    super(props);

    this.evolved = this.props.evolved;
    this.state = {
      back: false,
      evolving: false,
      evolved: false
    };
    this.counter = 7;
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

  getBackLink(name) {
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
      ? "http://pokestadium.com/sprites/xy/back/" + tempName + ".gif"
      : "/loader.gif";

    return imgLink;
  }

  updateState() {
    if (this.props.evolved && (!this.state.evolved && !this.state.evolving)) {
      this.setState(() => {
        return {
          back: true,
          evolving: true
        };
      });
      this.timer = setInterval(() => {
        this.setState(state => {
          return { back: !state.back };
        });
        this.counter--;
        if (this.counter === 0) {
          clearInterval(this.timer);
          this.setState({ evolving: false, evolved: true, back: false });
          this.props.evolveFunc();
        }
      }, 250);
    }
  }

  componentDidMount() {
    this.updateState();
  }
  componentDidUpdate() {
    this.updateState();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {
      classes,
      idx,
      begin_name,
      evolve_name,
      star,
      evolved,
      noTopMargin
    } = this.props;
    const gameCardFrontClasses = classNames({
      [classes.cardFront]: true,
      [classes.cardEvolved]: evolved
    });

    const imgLink = this.state.evolving
      ? "/card-back.png"
      : evolved
      ? this.getLink(evolve_name)
      : this.getLink(begin_name);

    const name = evolved ? this.getLink(evolve_name) : this.getLink(begin_name);

    const card = (
      <ReactCardFlip
        isFlipped={this.state.back}
        flipSpeedBackToFront={0.2}
        flipSpeedFrontToBack={0.2}
      >
        <Card key="back" game className={classes.cardPngBack}>
          <div className={classes.imageSquare}>
            <img
              className={classes.sprite}
              src={"/card-back-round.png"}
              alt={"card back"}
            />
          </div>
        </Card>
        <Card
          key="front"
          game
          className={
            this.state.evolving ? classes.cardPngBack : gameCardFrontClasses
          }
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
    );

    return (
      <div
        style={
          noTopMargin
            ? { marginBottom: "30px" }
            : { marginTop: "30px", marginBottom: "30px" }
        }
      >
        {card}
      </div>
    );
  }
}

EvolveCard.propTypes = {
  classes: PropTypes.object.isRequired,
  idx: PropTypes.number,
  begin_name: PropTypes.string,
  evolve_name: PropTypes.string,
  evolved: PropTypes.bool,
  star: PropTypes.bool,
  evolveFunc: PropTypes.func,
  noTopMargin: PropTypes.bool
};

export default withStyles(style)(EvolveCard);
