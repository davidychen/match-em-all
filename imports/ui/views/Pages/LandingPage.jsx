import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import LandingPanels from "../../views/Components/LandingPanels.jsx";
import Parallax from "../../components/Parallax/Parallax.jsx";

import landingPageStyle from "../../assets/jss/material-dashboard-pro-react/views/landingPageStyle.jsx";

class LandingPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Parallax
          background="linear-gradient(to right, #ee1515, #EF4144)"
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={6}>
              <h2 className={classes.title}>Gotta Match &apos;Em All</h2>
              <h5 className={classes.description}>
                This is a Pokemon card match game!
              </h5>
            </GridItem>
          </GridContainer>
        </Parallax>
        <LandingPanels />
      </div>
    );
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(landingPageStyle)(LandingPage);
