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
import ArrowDownward from "@material-ui/icons/ArrowDownward";
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
  sortBy: "pokemonId",
  order: 1,
  limit: 0
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
      orderSelect: 1,
      filterSelect: "",
      filterOptionSelect: ""
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
      sortBy: "pokemonId",
      order: 1,
      limit: 0
    });
  }

  handleSort = event => {
    this.setState({ [event.target.name]: event.target.value });

    /*console.log("client side", event.target.value, sortBy);*/
    const sortBy = event.target.value === "" ? "pokemonId" : event.target.value;
    if (!stateDict.equals("sortBy", sortBy)) {
      stateDict.set({ sortBy: sortBy, limit: 0 });
    }
  };
  handleFilter = event => {
    if (event.target.value !== this.state[event.target.name]) {
      this.setState({ filterOptionSelect: "" });
      this.setState({ [event.target.name]: event.target.value });
      const filterBy = event.target.value === "" ? "all" : event.target.value;
      if (!stateDict.equals("filterBy", filterBy)) {
        if (["type", "color"].indexOf(filterBy) < 0) {
          stateDict.set({ filterBy: filterBy, filterKey: true, limit: 0 });
        } else {
          if (!stateDict.equals("filterBy", "all")) {
            stateDict.set({ filterBy: "all", filterKey: true, limit: 0 });
          }
        }
      }
    }
  };

  handleFilterOption = event => {
    if (event.target.value !== this.state[event.target.name]) {
      this.setState({ [event.target.name]: event.target.value });
      const filterBy = this.state.filterSelect;
      const filterKey = event.target.value;
      if (filterKey === "") {
        if (!stateDict.equals("filterBy", "all")) {
          stateDict.set({ filterBy: "all", filterKey: true, limit: 0 });
        }
      } else if (!stateDict.equals("filterKey", filterKey)) {
        stateDict.set({ filterBy: filterBy, filterKey: filterKey, limit: 0 });
      }
    }
  };

  handleOrder = () => {
    stateDict.set({ order: -this.state.orderSelect, limit: 0 });
    this.setState(state => {
      return { orderSelect: -state.orderSelect };
    });
  };

  optionItems(classes) {
    let list = [];
    if (this.state.filterSelect === "type") {
      list = [
        "normal",
        "fighting",
        "flying",
        "poison",
        "ground",
        "rock",
        "bug",
        "ghost",
        "steel",
        "fire",
        "water",
        "grass",
        "electric",
        "psychic",
        "ice",
        "dragon",
        "dark",
        "fairy",
        "unknown",
        "shadow"
      ];
    } else if (this.state.filterSelect === "color") {
      list = [
        "black",
        "blue",
        "brown",
        "gray",
        "green",
        "pink",
        "purple",
        "red",
        "white",
        "yellow"
      ];
    }
    return list.map((el, idx) => {
      return (
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={el}
          key={idx}
        >
          {el.charAt(0).toUpperCase() + el.slice(1)}
        </MenuItem>
      );
    });
  }

  renderFilterOption(classes) {
    const disable = ["type", "color"].indexOf(this.state.filterSelect) < 0;
    if (!disable) {
      const titleName = disable
        ? "Filter Option"
        : "Choose " +
          this.state.filterSelect.charAt(0).toUpperCase() +
          this.state.filterSelect.slice(1);
      return (
        <GridItem xs={12} sm={6} md={6} lg={6}>
          <FormControl
            disabled={disable}
            fullWidth
            className={classes.selectFormControl}
          >
            <InputLabel
              htmlFor="filter-option-select"
              className={classes.selectLabel}
            >
              {titleName}
            </InputLabel>
            <Select
              MenuProps={{
                className: classes.selectMenu
              }}
              classes={{
                select: classes.select
              }}
              value={this.state.filterOptionSelect}
              onChange={this.handleFilterOption}
              inputProps={{
                name: "filterOptionSelect",
                id: "filter-option-select"
              }}
            >
              <MenuItem
                classes={{ root: classes.selectMenuItemHeader }}
                value=""
              >
                {titleName}
              </MenuItem>
              {this.optionItems(classes)}
            </Select>
          </FormControl>
        </GridItem>
      );
    }
  }

  renderSelection(classes) {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={6} lg={6}>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <InputLabel
                          htmlFor="filter-select"
                          className={classes.selectLabel}
                        >
                          Filter By
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.filterSelect}
                          onChange={this.handleFilter}
                          inputProps={{
                            name: "filterSelect",
                            id: "filter-select"
                          }}
                        >
                          <MenuItem
                            classes={{ root: classes.selectMenuItemHeader }}
                            value=""
                          >
                            Filter By
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="type"
                          >
                            Type
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="color"
                          >
                            Color
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="can_evolve"
                          >
                            Can Evolve
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="legendary"
                          >
                            Legendary
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                    {this.renderFilterOption(classes)}
                  </GridContainer>
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  {/*<legend>Select</legend>*/}

                  <GridContainer>
                    <GridItem xs={8} sm={4} md={4} lg={4}>
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
                            classes={{
                              root: classes.selectMenuItemHeader
                            }}
                            value=""
                          >
                            Sort By
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="pokemonId"
                          >
                            Pokemon ID
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="name_en"
                          >
                            Name
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="rate"
                          >
                            Rarity
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="firstAt"
                          >
                            Match Time
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="count"
                          >
                            Count
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={4} sm={2} md={2} lg={2}>
                      {this.state.orderSelect === 1 && (
                        <Button
                          color="primary"
                          justIcon
                          round
                          className={classes.orderButton}
                          onClick={this.handleOrder.bind(this)}
                        >
                          <ArrowUpward className={classes.icons} />
                        </Button>
                      )}
                      {this.state.orderSelect === -1 && (
                        <Button
                          color="primary"
                          justIcon
                          round
                          className={classes.orderButton}
                          onClick={this.handleOrder.bind(this)}
                        >
                          <ArrowDownward className={classes.icons} />
                        </Button>
                      )}
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
          pageStart={0}
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
    if (this.props.pokemons.length === stateDict.get("limit")) {
      stateDict.set("limit", stateDict.get("limit") + 18);
    }
  }

  render() {
    /*if (this.props.ready) {
      console.log(this.props.pokemons.length);
      console.log(this.props.filterCount, this.props.totalCount);
    }*/

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
