import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
// nodejs library that concatenates classes
import { Daily, Types } from "../../../api/pokemon.js";
import moment from "moment";

// react plugin for creating charts
import ChartistGraph from "react-chartist";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";
import PieChart from "@material-ui/icons/PieChart";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import NavPills from "../../components/NavPills/NavPills.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import Badge from "../../components/Badge/Badge.jsx";

let Chartist = require("chartist");
let delays = 80,
  durations = 500;

import landingPanelStyle from "../../assets/jss/material-dashboard-pro-react/views/landingPanelStyle.jsx";

class LandingPanels extends React.Component {
  constructor() {
    super();
  }

  getDailyChart(daily) {
    const dailyChart = {
      data: {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        series: [[0, 0, 0, 0, 0, 0, 0]]
      },
      options: {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        height: "300px",
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      // for animation
      animation: {
        draw: function(data) {
          if (data.type === "line" || data.type === "area") {
            data.element.animate({
              d: {
                begin: 600,
                dur: 700,
                from: data.path
                  .clone()
                  .scale(1, 0)
                  .translate(0, data.chartRect.height())
                  .stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
              }
            });
          } else if (data.type === "point") {
            data.element.animate({
              opacity: {
                begin: (data.index + 1) * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: "ease"
              }
            });
          }
        }
      }
    };
    if (daily) {
      const staringDate = moment()
        .startOf("day")
        .subtract(7, "days");
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const labels = [];
      const seriesOne = [];
      for (let i = 0; i < 7; i++) {
        const date = staringDate.add(1, "days");
        const found = daily.find(el => {
          /*console.log(date.diff(moment(el.date), "days", true));*/
          return Math.floor(date.diff(moment(el.date), "days", true)) == 0;
        });

        labels.push(days[date.day()]);
        if (found) {
          seriesOne.push(found.count);
        } else {
          seriesOne.push(0);
        }
      }
      const minCount = Math.min(...seriesOne);
      const maxCount = Math.max(10, Math.floor(Math.max(...seriesOne) * 1.2));
      dailyChart["data"] = { labels: labels, series: [seriesOne] };
      dailyChart.options.low = minCount;
      dailyChart.options.high = maxCount > 0 ? maxCount : 10;
    }
    return dailyChart;
  }

  getPieChart(classes, types) {
    const pieChart = {
      data: {
        labels: ["Empty"],
        series: [{ value: 100, className: classes.emptyFill }]
      },
      options: {
        height: "300px"
      }
    };
    this.legend = [];
    if (types && types.length > 0) {
      let counts = [];
      let series = [];
      types
        .sort((a, b) => a.typeId - b.typeId)
        .forEach(type => {
          counts.push(type.count);
          series.push({
            value: type.count,
            className: classes[type.type + "Fill"]
          });
          this.legend.push(type.type);
        });
      const sum = counts.reduce((a, b) => a + b);
      const labels = counts.map(
        count => "" + Math.round((count / sum) * 100) + "%"
      );
      pieChart["data"] = {
        labels: labels,
        series: series
      };
    }
    return pieChart;
  }

  renderLegend(classes) {
    if (this.legend.length > 0) {
      const content = this.legend.map((el, idx) => (
        <Badge color={el} key={idx}>
          {el}
        </Badge>
      ));
      return (
        <CardFooter stats className={classes.cardFooter}>
          <h6 className={classes.legendTitle}>Legend</h6>
          <div className={classes.legendBadge}>{content}</div>
        </CardFooter>
      );
    }
  }
  render() {
    const { classes, daily, types } = this.props;
    const pieChart = this.getPieChart(classes, types);
    const dailyChart = this.getDailyChart(daily);
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
                        data={dailyChart.data}
                        type="Line"
                        options={dailyChart.options}
                        listener={dailyChart.animation}
                      />
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>
                        Daily Pokemons Matched
                      </h4>
                      <p className={classes.cardCategory}>
                        Number of Pokemons Matched in the past week
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
                    {this.renderLegend(classes)}
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
  classes: PropTypes.object,
  daily: PropTypes.arrayOf(PropTypes.object),
  types: PropTypes.arrayOf(PropTypes.object)
};

export default withTracker(() => {
  const handleDaily = Meteor.subscribe("daily");
  const handleTypes = Meteor.subscribe("types");
  return {
    daily: Daily.find({}).fetch(),
    types: Types.find({}).fetch(),
    ready: handleDaily.ready() && handleTypes.ready()
  };
})(withStyles(landingPanelStyle)(LandingPanels));
