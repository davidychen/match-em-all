import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Board } from "../../../api/pokemon.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Chat from "@material-ui/icons/Chat";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Help from "@material-ui/icons/Help";
import List from "@material-ui/icons/List";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
import Place from "@material-ui/icons/Place";
import ArtTrack from "@material-ui/icons/ArtTrack";
import Language from "@material-ui/icons/Language";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Table from "../../components/Table/Table.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Danger from "../../components/Typography/Danger.jsx";
import Card from "../../components/Card/Card.jsx";
import GameCard from "../../components/Card/GameCard.jsx";
import GameCardFront from "../../components/Card/GameCardFront.jsx";
import GameCardBack from "../../components/Card/GameCardBack.jsx";
import Heading from "../../components/Heading/Heading.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import Loader from "react-loader-spinner";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "../../variables/charts";

import gameStyle from "../../assets/jss/material-dashboard-pro-react/views/gameStyle";

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      flip: false
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
  appendName(name, legendary) {
    return legendary ? "&#9733; " + name + "&#9733;" : name;
  }

  calcInfo(board) {
    let userCount = 0;
    let nonMatchCount = 0;
    let totalCount = 0;
    let yourLastAt = undefined;
    let yourLast = undefined;
    let lastMatchAt = undefined;
    let lastMatchUser = undefined;
    let lastMatch = undefined;

    board.map(card => {
      if (card.match) {
        if (card.ownerId === this.props.user._id) {
          userCount++;
          if (yourLast === undefined) {
            yourLast = this.appendName(
              card.pokemon.name_en,
              card.pokemon.legendary
            );
            yourLastAt = card.matchAt;
          } else {
            if (card.matchAt > yourLastAt) {
              yourLast = this.appendName(
                card.pokemon.name_en,
                card.pokemon.legendary
              );
              yourLastAt = card.matchAt;
            }
          }
        }
        if (lastMatch === undefined) {
          lastMatch = this.appendName(
            card.pokemon.name_en,
            card.pokemon.legendary
          );
          lastMatchAt = card.matchAt;
          lastMatchUser =
            card.ownerId === this.props.user._id ? "You" : card.ownerName;
        } else {
          if (card.matchAt > lastMatchAt) {
            lastMatch = this.appendName(
              card.pokemon.name_en,
              card.pokemon.legendary
            );
            lastMatchAt = card.matchAt;
            lastMatchUser =
              card.ownerId === this.props.user._id ? "You" : card.ownerName;
          }
        }
      }
      if (!card.match) {
        nonMatchCount++;
      }
      totalCount++;
    });
    this.userCount = Math.floor(userCount / 2);
    this.nonMatchCount = Math.floor(nonMatchCount / 2);
    this.totalCount = Math.floor(totalCount / 2);
    this.yourLastAt = yourLastAt;
    this.yourLast = yourLast;
    this.lastMatchAt = lastMatchAt;
    this.lastMatchUser = lastMatchUser;
    this.lastMatch = lastMatch;
  }

  renderAvatars(classes) {
    if (this.props.players) {
      const avatars = this.props.players
        .sort((a, b) => a.status.lastLogin.date - b.status.lastLogin.date)
        .map((player, idx) => {
          return (
            <Tooltip
              id="tooltip-top"
              title={player.username}
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
              key={idx}
            >
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
            </Tooltip>
          );
        });
      return <div>{avatars}</div>;
    }
  }

  renderLoading(classes) {
    if (!this.props.board || this.props.board.length === 0) {
      return (
        <div>
          <Heading title="Loading" textAlign="center" />
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

  renderInfoBox(classes) {
    if (this.props.board && this.props.board.length > 0) {
      this.calcInfo(this.props.board);
      return (
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <CheckCircle />
                </CardIcon>
                <p className={classes.cardCategory}>You matched</p>
                <h3 className={classes.cardTitle}>
                  {"" + this.userCount + "/" + this.totalCount}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />
                  {this.yourLast
                    ? "You just matched " + this.yourLast + "!"
                    : "Start your match now! "}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Help />
                </CardIcon>
                <p className={classes.cardCategory}>Not matched yet</p>
                <h3 className={classes.cardTitle}>
                  {"" + this.nonMatchCount + "/" + this.totalCount}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Chat />
                  {this.lastMatch
                    ? this.lastMatchUser +
                      " just matched " +
                      this.lastMatch +
                      "!"
                    : "You can be the first to match! "}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <AccountCircle />
                </CardIcon>
                <p className={classes.cardCategory}>Players</p>
                <h3 className={classes.cardTitle}>
                  {this.props.players.length}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {this.renderAvatars(classes)}
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
          <GridItem xs={6} sm={3} md={2} lg={2} key={idx}>
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
        {this.renderLoading(classes)}
        {this.renderInfoBox(classes)}
        {this.renderCards(classes)}
      </div>
    );
  }
}

Game.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  board: PropTypes.arrayOf(PropTypes.object),
  players: PropTypes.arrayOf(PropTypes.object),
  avatars: PropTypes.arrayOf(PropTypes.object)
};

export default withTracker(() => {
  const user = Meteor.user();
  const handleBoard = Meteor.subscribe("board");
  const handlePlayer = Meteor.subscribe("players");
  return {
    board: Board.find({}).fetch(),
    players: Meteor.users.find({}).fetch(),
    ready: handleBoard.ready() && handlePlayer.ready(),
    user: user
  };
})(withStyles(gameStyle)(Game));
