import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import TimeAgo from "react-timeago";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Collections } from "../../../api/collections.js";
import { ReactiveDict } from "meteor/reactive-dict";
import { Counts } from "meteor/tmeasday:publish-counts";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Chat from "@material-ui/icons/Chat";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Close from "@material-ui/icons/Close";
import Favorite from "@material-ui/icons/Favorite";
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

import collectionStyle from "../../assets/jss/material-dashboard-pro-react/views/collectionStyle";

const stateDict = new ReactiveDict();
stateDict.set({
  filterBy: "all",
  filterKey: true,
  sortBy: "index",
  order: 1,
  limit: 36
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Collection extends React.Component {
  constructor() {
    super();
    this.state = {
      flip: false,
      modal: false,
      sortSelect: "",
      orderSelect: "",
      filterSelect: ""
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
  }

  handleClickOpen() {
    this.setState({ modal: true });
  }
  handleClose() {
    this.setState({ modal: false });
  }

  componentDidMount() {}
  componentDidUpdate() {}

  componentWillUnmount() {
    stateDict.set({
      filterBy: "all",
      filterKey: true,
      sortBy: "index",
      order: 1,
      limit: 36
    });
  }

  handleSort = event => {
    this.setState({ [event.target.name]: event.target.value });
    let sortBy = "all";
    switch (event.target.value) {
    case "2":
      sortBy = "index";
      break;
    case "3":
      sortBy = "name";
      break;
    case "4":
      sortBy = "rarity";
      break;
    case "5":
      sortBy = "firstAt";
      break;
    case "6":
      sortBy = "count";
      break; 
    }
    console.log("client side", event.target.value, sortBy);
    if (!stateDict.equals("sortBy", sortBy)) {
      stateDict.set({ sortBy: sortBy, limit: 36 });
    }
  };

  renderSelection(classes) {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  {/*<legend>Select</legend>*/}
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={5} lg={5}>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <InputLabel
                          htmlFor="sort-select"
                          className={classes.selectLabel}
                        >
                          Sort By
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.sortSelect}
                          onChange={this.handleSort}
                          inputProps={{
                            name: "sortSelect",
                            id: "sort-select"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Sort By
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="2"
                          >
                            Pokemon ID
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="3"
                          >
                            Name
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="4"
                          >
                            Rarity
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="5"
                          >
                            Match Time
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="6"
                          >
                            Count
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

  renderLoading(classes) {
    /*if (!this.props.ready) {
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
    } else */
    if (this.props.ready && this.props.totalCount === 0) {
      return (
        <div>
          <GridContainer justify="center">
            <GridItem xs={12} sm={8} md={8} lg={6}>
              <Card>
                <CardBody style={{ textAlign: "center" }}>
                  <h3>You haven&apos;t matched any Pokemon</h3>
                  <p>You should start your match game now!</p>
                  <Button
                    color="primary"
                    round
                    component={props => <Link to="/admin/game" {...props} />}
                  >
                    Start matching
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      );
    } else if (this.props.ready && this.props.filterCount === 0) {
      return (
        <div>
          <GridContainer justify="center">
            <GridItem xs={12} sm={8} md={8} lg={6}>
              <Card>
                <CardBody style={{ textAlign: "center" }}>
                  <h3>No Pokemon Found</h3>
                  <p>
                    You have&apos;t matched any Pokemon in selected criteria.
                    Continue your game!
                  </p>
                  <Button
                    color="primary"
                    round
                    component={props => <Link to="/admin/game" {...props} />}
                  >
                    Continue matching
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      );
    }
  }

  renderCards(classes) {
    if (this.props.pokemons) {
      const pokemons = this.props.pokemons.map((pokemon, idx) => {
        return (
          <GridItem game xs={3} sm={2} md={2} lg={2} key={idx}>
            <GameCard
              idx={idx}
              name={pokemon.name}
              onClick={this.onClick.bind(this, pokemon.pokemonId)}
              star={pokemon.legendary}
              collection
            />
          </GridItem>
        );
      });
      return (
        <InfiniteScroll
          pageStart={1}
          loadMore={this.loadFunction.bind(this)}
          hasMore={this.props.pokemons.length < this.props.filterCount}
          loader={
            <GridContainer key={0}>
              <GridItem xs={12}>
                <Card plain>
                  <CardBody plain>
                    <div style={{ textAlign: "center" }}>
                      <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height="150"
                        width="150"
                      />
                    </div>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          }
          useWindow={false}
          getScrollParent={() => this.props.scrollRef}
        >
          <GridContainer className={classes.gamePadding}>
            {pokemons}
          </GridContainer>
        </InfiniteScroll>
      );
    }
  }

  loadFunction(page) {
    console.log(stateDict.get("limit"));
    if (this.props.pokemons.length === stateDict.get("limit")) {
      stateDict.set("limit", stateDict.get("limit") + 36);
    }
  }

  render() {
    if (this.props.ready) {
      console.log(this.props.pokemons.length);
      console.log(this.props.filterCount, this.props.totalCount);
    }

    const { classes } = this.props;
    return (
      <div>
        {this.renderSelection(classes)}
        {this.renderCards(classes)}
        {this.renderLoading(classes)}
      </div>
    );
  }
}

Collection.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  pokemons: PropTypes.arrayOf(PropTypes.object),
  ready: PropTypes.bool,
  filterCount: PropTypes.number,
  totalCount: PropTypes.number,
  scrollRef: PropTypes.object
};

export default withTracker(() => {
  const filterBy = stateDict.get("filterBy");
  const filterKey = stateDict.get("filterKey");
  const sortBy = stateDict.get("sortBy");
  const order = stateDict.get("order");
  const limit = stateDict.get("limit");
  const user = Meteor.user();
  const handle = Meteor.subscribe(
    "collections-with-count",
    filterBy,
    filterKey,
    sortBy,
    order,
    limit
  );
  return {
    pokemons: Collections.find({}).fetch(),
    ready: handle.ready(),
    user: user,
    filterCount: Counts.get("collection-filter-count"),
    totalCount: Counts.get("collection-total-count")
  };
})(withStyles(collectionStyle)(Collection));
