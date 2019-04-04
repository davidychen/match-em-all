import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
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
import GameCardFront from "../../components/Card/GameCardFront.jsx";
import GameCardBack from "../../components/Card/GameCardBack.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

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

class Dashboard extends React.Component {
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
  onClick() {
    this.setState({flip: !this.state.flip});
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <GameCardBack onClick={this.onClick} />
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <GameCardBack onClick={this.onClick}/>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <GameCardBack onClick={this.onClick}/>
          </GridItem>

          <GridItem xs={6} sm={3} md={2} lg={2}>
            <GameCardFront selected={this.state.flip} name={"pikachu"}/>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <GameCardFront selected={this.state.flip} name={"sceptile"}/>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <GameCardFront selected={this.state.flip} name={"sceptile"}/>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(gameStyle)(Dashboard);
