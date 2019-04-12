import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import TimeAgo from "react-timeago";
// react plugin for creating vector maps
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Board, MatchPlayers } from "../../../api/pokemon.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Close from "@material-ui/icons/Close";
import Favorite from "@material-ui/icons/Favorite";
import Help from "@material-ui/icons/Help";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Update from "@material-ui/icons/Update";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";

import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import GameCard from "../../components/Card/GameCard.jsx";
import Heading from "../../components/Heading/Heading.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import Loader from "react-loader-spinner";

import gameStyle from "../../assets/jss/material-dashboard-pro-react/views/gameStyle";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      flip: false,
      modal: false
    };
    this.onClick = this.onClick.bind(this);
  }
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  onClick(i) {
    this.setState({ flip: !this.state.flip });
    Meteor.call("card.flip", i);
  }

  handleClickOpen() {
    this.setState({ modal: true });
  }
  handleClose() {
    this.setState({ modal: false });
  }

  appendName(name, legendary) {
    return legendary
      ? String.fromCharCode(9733) + " " + name + " " + String.fromCharCode(9733)
      : name;
  }

  findCount(id) {
    if (this.props.matchPlayers) {
      const found = this.props.matchPlayers.find(el => el.ownerId === id);
      if (found) return found.count;
    }
    return 0;
  }

  calcInfo() {
    if (this.props.matchPlayers && this.props.user._id) {
      const found = this.props.matchPlayers.find(
        el => el.ownerId === this.props.user._id
      );
      if (found) {
        this.count = found.count;
        this.lastMatch = found.pokemon;
        this.matchAt = <TimeAgo date={found.matchAt} />;
        return;
      }
    }
    this.count = 0;
    this.lastMatch = "--";
    this.matchAt = "--";
  }

  renderAvatars(classes) {
    if (this.props.players && this.props.matchPlayers) {
      const avatars = this.props.players
        .sort((a, b) => a.status.lastLogin.date - b.status.lastLogin.date)
        .map((player, idx) => {
          const count = this.findCount(player._id);
          return (
            <Tooltip
              id="tooltip-top"
              title={player.username}
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
              key={idx}
            >
              <div className={classes.user}>
                <div className={classes.photo}>
                  <img
                    className={classes.avatarImg}
                    src={
                      player.profile && player.profile.avatarId
                        ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
                          player.profile.avatarId +
                          ".png"
                        : "/default-avatar.png"
                    }
                    alt={"avatar " + player.username}
                  />
                </div>
                <span className={classes.notifications}>{count}</span>
              </div>
            </Tooltip>
          );
        });
      return <React.Fragment>{avatars}</React.Fragment>;
    }
  }

  renderLoading() {
    if (!this.props.board || this.props.board.length === 0) {
      return (
        <div>
          <Heading title="Loading..." textAlign="center" />
          <GridContainer>
            <GridItem xs={12}>
              <Card plain>
                <CardBody plain>
                  <div style={{ textAlign: "center" }}>
                    <Loader
                      type="Watch"
                      color="#00BFFF"
                      height="150"
                      width="150"
                    />
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      );
    }
  }

  renderAvatarBox(classes) {
    if (this.props.players && this.props.matchPlayers) {
      return (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardBody avatar>
                <div className={classes.stats + " " + classes.avatar}>
                  {this.renderAvatars(classes)}
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    }
  }

  renderInfoBox(classes) {
    if (this.props.board && this.props.matchPlayers && this.props.user) {
      this.calcInfo();
      return (
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <CheckCircle />
                </CardIcon>
                <p className={classes.cardCategory}>You matched</p>
                <h3 className={classes.cardTitle}>
                  {"" +
                    this.count +
                    "/" +
                    Math.floor(this.props.board.length / 2)}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Help />
                  <a href="#" onClick={() => this.handleClickOpen()}>
                    How to play
                  </a>
                </div>
                <Dialog
                  classes={{
                    root: classes.center + " " + classes.modalRoot,
                    paper: classes.modal
                  }}
                  open={this.state.modal}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={() => this.handleClose()}
                  aria-labelledby="classic-modal-slide-title"
                  aria-describedby="classic-modal-slide-description"
                >
                  <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={classes.modalHeader}
                  >
                    <Button
                      justIcon
                      className={classes.modalCloseButton}
                      key="close"
                      aria-label="Close"
                      color="transparent"
                      onClick={() => this.handleClose("classicModal")}
                    >
                      <Close className={classes.modalClose} />
                    </Button>
                    <h4 className={classes.modalTitle}>How To Play</h4>
                  </DialogTitle>
                  <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                  >
                    <p>
                      Turn over (by clicking them) any two cards and add them
                      into your collection if the cards match. If two cards do
                      not match, those cards are turned face down again.
                    </p>
                    <p>
                      Blue cards are those selected by you, Green ones are
                      matched by you, and red ones are matched by other players.
                    </p>
                  </DialogContent>
                  <DialogActions className={classes.modalFooter}>
                    <Button
                      onClick={() => this.handleClose("classicModal")}
                      color="danger"
                      simple
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Favorite />
                </CardIcon>
                <p className={classes.cardCategory}>Last matched Pokemon</p>
                <h3 className={classes.cardTitle}>{this.lastMatch}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  {"Matched at: "}
                  {this.matchAt}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      );
    }
  }
  renderCards(classes) {
    if (this.props.board) {
      const cards = this.props.board.map((card, idx) => {
        return (
          <GridItem game xs={3} sm={2} md={2} lg={2} key={idx}>
            <GameCard
              idx={idx}
              name={card.pokemon && card.pokemon.name}
              back={card.ownerId === undefined}
              onClick={this.onClick.bind(this, idx)}
              selected={!card.match && card.ownerId === this.props.user._id}
              matched={card.match && card.ownerId !== this.props.user._id}
              matchedOwn={card.match && card.ownerId === this.props.user._id}
              star={card.pokemon && card.pokemon.legendary}
            />
          </GridItem>
        );
      });
      return (
        <GridContainer className={classes.gamePadding}>{cards}</GridContainer>
      );
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.renderAvatarBox(classes)}
        {this.renderInfoBox(classes)}
        {this.renderCards(classes)}
        {this.renderLoading(classes)}
      </div>
    );
  }
}

Game.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  board: PropTypes.arrayOf(PropTypes.object),
  players: PropTypes.arrayOf(PropTypes.object),
  matchPlayers: PropTypes.arrayOf(PropTypes.object),
  avatars: PropTypes.arrayOf(PropTypes.object)
};

export default withTracker(() => {
  const user = Meteor.user();
  const handleBoard = Meteor.subscribe("board");
  const handlePlayer = Meteor.subscribe("players");
  return {
    board: Board.find({}).fetch(),
    players: Meteor.users.find({}).fetch(),
    matchPlayers: MatchPlayers.find({}).fetch(),
    ready: handleBoard.ready() && handlePlayer.ready(),
    user: user
  };
})(withStyles(gameStyle)(Game));
