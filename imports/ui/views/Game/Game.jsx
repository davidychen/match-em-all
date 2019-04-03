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
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card game>
              <div style={{ position: "relative" }}>
                <div className={classes.cardBack}>
                  <div className={classes.cardBackDivider} />
                  <div className={classes.cardBackCircle} />
                </div>
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card>
              <div className={classes.imageSquare}>
                <img src="http://pokestadium.com/sprites/xy/sceptile.gif" />
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card>
              <div className={classes.cardSquare}>
                <div className={classes.imageSquare}>
                  <img src="http://pokestadium.com/sprites/xy/sceptile.gif" />
                </div>
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card game>
              <div className={classes.cardSquare}>
                <div className={classes.imageSquare}>
                  <img src="http://pokestadium.com/sprites/xy/sceptile.gif" />
                </div>
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card game>
              <div className={classes.cardSquare}>
                <div className={classes.imageSquare}>
                  <img src="http://pokestadium.com/sprites/xy/sceptile.gif" />
                </div>
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card plain>
              <div className={classes.cardSquare}>
                <div className={classes.imageSquare} />
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card>
              <div className={classes.cardSquare}>
                <div className={classes.imageSquare}>
                  <img src="/favicon.png" />
                </div>
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card>
              <div className={classes.cardSquare}>
                <div className={classes.imageSquare}>
                  <img src="http://pokestadium.com/sprites/xy/sceptile.gif" />
                </div>
              </div>
            </Card>
          </GridItem>
          <GridItem xs={6} sm={3} md={2} lg={2}>
            <Card game plain />
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>Revenue</p>
                <h3 className={classes.cardTitle}>$34,245</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  Last 24 Hours
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Fixed Issues</p>
                <h3 className={classes.cardTitle}>75</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />
                  Tracked from Github
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <i className="fab fa-twitter" />
                </CardIcon>
                <p className={classes.cardCategory}>Followers</p>
                <h3 className={classes.cardTitle}>+245</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
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
