import React from "react";
import PropTypes from "prop-types";
import { Redirect, Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
// import LandingPanels from "../../views/Components/LandingPanels.jsx";
// import Parallax from "../../components/Parallax/Parallax.jsx";
// import Wizard from "../../views/Forms/Wizard.jsx";

// import Home from "@material-ui/icons/Home";
// import Business from "@material-ui/icons/Business";
// import AccountBalance from "@material-ui/icons/AccountBalance";
// import Icon from "@material-ui/core/Icon";
import VideogameAsset from "@material-ui/icons/VideogameAsset";
import Collections from "@material-ui/icons/Collections";
import Star from "@material-ui/icons/Star";

import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";

import landingPageStyle from "../../assets/jss/material-dashboard-pro-react/views/landingPageStyle.jsx";

// @material-ui/icons
// import Dashboard from "@material-ui/icons/Dashboard";
// import Schedule from "@material-ui/icons/Schedule";
// import Info from "@material-ui/icons/Info";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Gavel from "@material-ui/icons/Gavel";
// import HelpOutline from "@material-ui/icons/HelpOutline";

// core components
import NavPills from "../../components/NavPills/NavPills.jsx";
// import CardHeader from "../../components/Card/CardHeader.jsx";
import GameCard from "../../components/Card/GameCard.jsx";
import EvolveCard from "../../components/Card/EvolveCard.jsx";

const start_pokemons = [
  "bulbasaur",
  "charmander",
  "squirtle",
  "chikorita",
  "cyndaquil",
  "totodile",
  "treecko",
  "torchic",
  "mudkip",
  "turtwig",
  "chimchar",
  "piplup",
  "snivy",
  "tepig",
  "oshawott",
  "chespin",
  "fennekin",
  "froakie"
];
const evolve_pokemons = [
  "ivysaur",
  "charmeleon",
  "wartortle",
  "bayleef",
  "quilava",
  "croconaw",
  "grovyle",
  "combusken",
  "marshtomp",
  "grotle",
  "monferno",
  "prinplup",
  "servine",
  "pignite",
  "dewott",
  "quilladin",
  "braixen",
  "frogadier"
];

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.idx = Math.floor(Math.random() * start_pokemons.length);
    this.begin_name = start_pokemons[this.idx];
    this.evolve_name = evolve_pokemons[this.idx];
    this.state = {
      card0: false,
      card1: false,
      activePill: 0,
      matched: false,
      evolved: false,
      evolvedName: "???",
      disableButton: false,
      moreButton: false
    };
  }
  onClick(i) {
    this.setState({ ["card" + i]: true });
    if (this.state["card" + (i ^ 1)]) {
      this.setState({ matched: true });
      this.matchTimtout = setTimeout(() => {
        if (this.state.activePill < 1) {
          this.goCollection();
        }
      }, 3000);
    }
  }

  evolve() {
    if (!this.state.disableButton && !this.state.moreButton) {
      this.setState({ evolved: true, disableButton: true });
    }
    if (this.state.moreButton) {
      this.setState({ activePill: 2 });
    }
  }
  evolved() {
    const name =
      this.evolve_name.charAt(0).toUpperCase() +
      this.evolve_name.slice(1) +
      "!";
    this.setState({
      evolvedName: name,
      disableButton: false,
      moreButton: true
    });
  }
  goCollection() {
    this.setState({ activePill: 1 });
  }
  changeActive = index => {
    this.setState({ activePill: index });
  };

  componentWillUnmount() {
    clearTimeout(this.matchTimtout);
  }

  getStart() {
    return <Redirect to="/register-page" />;
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center" landingTitle>
          <GridItem xs={12} sm={12} md={6}>
            <h2 className={classes.title}>Gotta Match &apos;Em All</h2>
            <h3 className={classes.description}>
              This is a Pokemon card match game!
            </h3>
          </GridItem>
        </GridContainer>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <NavPills
              color="white"
              alignCenter
              landing
              active={this.state.activePill}
              controlActive={this.changeActive}
              tabs={[
                {
                  tabButton: "Match",
                  tabIcon: VideogameAsset,
                  tabContent: (
                    <Card pricing raised>
                      <CardBody pricing>
                        <h4 className={classes.cardTitle}>
                          {"Find the matching " +
                            this.begin_name.charAt(0).toUpperCase() +
                            this.begin_name.slice(1) +
                            "s"}
                        </h4>
                        <div className={classes.cards}>
                          <div className={classes.card}>
                            <GameCard
                              idx={this.idx}
                              name={this.begin_name}
                              back={!this.state.card0}
                              onClick={this.onClick.bind(this, 0)}
                              matchedOwn={this.state.matched}
                            />
                          </div>
                          <div className={classes.card}>
                            <GameCard
                              idx={this.idx}
                              name={this.begin_name}
                              back={!this.state.card1}
                              onClick={this.onClick.bind(this, 1)}
                              matchedOwn={this.state.matched}
                            />
                          </div>
                        </div>
                        <h3
                          className={`${classes.cardTitle} ${
                            classes.marginTop30
                          }`}
                        >
                          {"Found " + (this.state.card0 + this.state.card1)}
                        </h3>
                        <p className={classes.cardDescription}>
                          Flip the cards above by clicking and they will turn
                          green when they are matched.
                        </p>
                        <Button
                          round
                          color="primary"
                          onClick={this.goCollection.bind(this)}
                        >
                          Check Collection
                        </Button>
                      </CardBody>
                    </Card>
                  )
                },
                {
                  tabButton: "Collect",
                  tabIcon: Collections,
                  tabContent: (
                    <Card pricing raised>
                      <CardBody pricing>
                        <h4 className={classes.cardTitle}>
                          {this.state.matched
                            ? "All matched pokemons will show in your collection"
                            : "You need match one first"}
                        </h4>
                        <div className={classes.cards}>
                          <div className={classes.card}>
                            {!this.state.matched ? (
                              <GameCard idx={2} inactive />
                            ) : (
                              <EvolveCard
                                idx={2}
                                begin_name={this.begin_name}
                                evolve_name={this.evolve_name}
                                evolved={this.state.evolved}
                                evolveFunc={this.evolved.bind(this)}
                              />
                            )}
                          </div>
                        </div>
                        <h3
                          className={`${classes.cardTitle} ${
                            classes.marginTop30
                          }`}
                        >
                          {"Evolves to " + this.state.evolvedName}
                        </h3>
                        <p className={classes.cardDescription}>
                          When you matched 3 pokemons of the same, you will be
                          able to evolve them
                        </p>
                        <Button
                          round
                          color={this.state.moreButton ? "success" : "primary"}
                          onClick={this.evolve.bind(this)}
                          disabled={
                            !this.state.matched || this.state.disableButton
                          }
                        >
                          {this.state.moreButton ? "More!" : "Evolve!"}
                        </Button>
                      </CardBody>
                    </Card>
                  )
                },
                {
                  tabButton: "More",
                  tabIcon: Star,
                  tabContent: (
                    <Card pricing raised>
                      <CardBody pricing>
                        <h4 className={classes.cardTitle}>
                          You will match even more Pokemons
                        </h4>
                        <div className={classes.cards}>
                          <div className={classes.card}>
                            <GameCard
                              idx={this.idx}
                              name={"xerneas"}
                              star
                              collection
                            />
                          </div>
                          <div className={classes.card}>
                            <GameCard
                              idx={this.idx}
                              name={"yveltal"}
                              star
                              collection
                            />
                          </div>
                        </div>
                        <h3
                          className={`${classes.cardTitle} ${
                            classes.marginTop30
                          }`}
                        >
                          Legendary Pokemons
                        </h3>
                        <p className={classes.cardDescription}>
                          Do you want to match them all?
                        </p>
                        <Link to="/register-page">
                        <Button
                          round
                          color="primary"
                        >
                          Get Started Now
                        </Button>
                        </Link>
                      </CardBody>
                    </Card>
                  )
                }
              ]}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(landingPageStyle)(LandingPage);
