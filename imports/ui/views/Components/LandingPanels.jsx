import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Schedule from "@material-ui/icons/Schedule";
import Timeline from "@material-ui/icons/Timeline";
import PieChart from "@material-ui/icons/PieChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Gavel from "@material-ui/icons/Gavel";
import HelpOutline from "@material-ui/icons/HelpOutline";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import NavPills from "../../components/NavPills/NavPills.jsx";
import Accordion from "../../components/Accordion/Accordion.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import {
  dailySalesChart,
  roundedLineChart,
  straightLinesChart,
  simpleBarChart,
  colouredLineChart,
  multipleBarsChart,
  colouredLinesChart,
  pieChart
} from "../../variables/charts.jsx";

import landingPanelStyle from "../../assets/jss/material-dashboard-pro-react/views/landingPanelStyle.jsx";

class LandingPanels extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center" landing>
        <GridItem xs={12} sm={12} md={8}>
          <NavPills
            color="black"
            alignCenter
            landing
            tabs={[
              {
                tabButton: "Pokemons",
                tabIcon: Timeline,
                tabContent: (
                  <Card chart>
                    <CardHeader color="white">
                      <ChartistGraph
                        data={dailySalesChart.data}
                        type="Line"
                        options={dailySalesChart.options}
                        listener={dailySalesChart.animation}
                      />
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>
                        Daily Pokemons Matched
                      </h4>
                      <p className={classes.cardCategory}>
                        Cumulative Number of Pokemons by Day
                      </p>
                    </CardBody>
                  </Card>
                )
              },
              {
                tabButton: "Types",
                tabIcon: PieChart,
                tabContent: (
                  <Card>
                    <CardHeader color="white">
                      <ChartistGraph
                        data={pieChart.data}
                        type="Pie"
                        options={pieChart.options}
                      />
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>
                        All Matched Pokemon Types
                      </h4>
                      <p className={classes.cardCategory}>
                        Percentage of all Pokemons&apos; Types
                      </p>
                    </CardBody>
                    <CardFooter stats className={classes.cardFooter}>
                      <h6 className={classes.legendTitle}>Legend</h6>
                      <i
                        className={"fas fa-circle " + classes.info}
                      /> Fire{" "}
                      <i className={"fas fa-circle " + classes.warning} /> Water{" "}
                      <i className={"fas fa-circle " + classes.danger} /> Grass{" "}
                    </CardFooter>
                  </Card>
                )
              }
            ]}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

LandingPanels.propTypes = {
  classes: PropTypes.object
};

export default withStyles(landingPanelStyle)(LandingPanels);

/*
import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Schedule from "@material-ui/icons/Schedule";
import Info from "@material-ui/icons/Info";
import LocationOn from "@material-ui/icons/LocationOn";
import Gavel from "@material-ui/icons/Gavel";
import HelpOutline from "@material-ui/icons/HelpOutline";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import NavPills from "../../components/NavPills/NavPills.jsx";
import Accordion from "../../components/Accordion/Accordion.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";

import { cardTitle } from "../../assets/jss/material-dashboard-pro-react.jsx";

const styles = {
  cardTitle,
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  },
  cardCategory: {
    margin: "0",
    color: "#999999"
  }
};

class Panels extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        
        <GridContainer justify="center" >
          <GridItem xs={12} sm={12} md={8}>
            <h3 className={classes.pageSubcategoriesTitle}>
              Page Subcategories
            </h3>
            <br />
            <NavPills
              color="warning"
              alignCenter
              tabs={[
                {
                  tabButton: "Description",
                  tabIcon: Info,
                  tabContent: (
                    <Card>
                      <CardHeader>
                        <h4 className={classes.cardTitle}>
                          Description about product
                        </h4>
                        <p className={classes.cardCategory}>
                          More information here
                        </p>
                      </CardHeader>
                      <CardBody>
                        Collaboratively administrate empowered markets via
                        plug-and-play networks. Dynamically procrastinate B2C
                        users after installed base benefits.
                        <br />
                        <br />
                        Dramatically visualize customer directed convergence
                        without revolutionary ROI.
                      </CardBody>
                    </Card>
                  )
                },
                {
                  tabButton: "Location",
                  tabIcon: LocationOn,
                  tabContent: (
                    <Card>
                      <CardHeader>
                        <h4 className={classes.cardTitle}>
                          Location of the product
                        </h4>
                        <p className={classes.cardCategory}>
                          More information here
                        </p>
                      </CardHeader>
                      <CardBody>
                        Efficiently unleash cross-media information without
                        cross-media value. Quickly maximize timely deliverables
                        for real-time schemas.
                        <br />
                        <br />
                        Dramatically maintain clicks-and-mortar solutions
                        without functional solutions.
                      </CardBody>
                    </Card>
                  )
                },
                {
                  tabButton: "Legal Info",
                  tabIcon: Gavel,
                  tabContent: (
                    <Card>
                      <CardHeader>
                        <h4 className={classes.cardTitle}>
                          Legal info of the product
                        </h4>
                        <p className={classes.cardCategory}>
                          More information here
                        </p>
                      </CardHeader>
                      <CardBody>
                        Completely synergize resource taxing relationships via
                        premier niche markets. Professionally cultivate
                        one-to-one customer service with robust ideas.
                        <br />
                        <br />
                        Dynamically innovate resource-leveling customer service
                        for state of the art customer service.
                      </CardBody>
                    </Card>
                  )
                },
                {
                  tabButton: "Help Center",
                  tabIcon: HelpOutline,
                  tabContent: (
                    <Card>
                      <CardHeader>
                        <h4 className={classes.cardTitle}>Help center</h4>
                        <p className={classes.cardCategory}>
                          More information here
                        </p>
                      </CardHeader>
                      <CardBody>
                        From the seamless transition of glass and metal to the
                        streamlined profile, every detail was carefully
                        considered to enhance your experience. So while its
                        display is larger, the phone feels just right.
                        <br />
                        <br />
                        Another Text. The first thing you notice when you hold
                        the phone is how great it feels in your hand. The cover
                        glass curves down around the sides to meet the anodized
                        aluminum enclosure in a remarkable, simplified design.
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

export default withStyles(styles)(Panels);
*/
