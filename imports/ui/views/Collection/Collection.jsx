import React from "react";
import PropTypes from "prop-types";
import TimeAgo from "react-timeago";
// react plugin for creating charts
// react plugin for creating vector maps
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Collections } from "../../../api/collections.js";
import { ReactiveDict } from "meteor/reactive-dict";
import { Counts } from "meteor/tmeasday:publish-counts";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Close from "@material-ui/icons/Close";
// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import GameCard from "../../components/Card/GameCard.jsx";
import EvolveColCard from "../../components/Card/EvolveColCard.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardAvatar from "../../components/Card/CardAvatar.jsx";
import Badge from "../../components/Badge/Badge.jsx";

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
    this.defaultPokemon = {
      pokemonId: 0,
      name: "",
      name_en: "???",
      type: ["unknown"],
      legendary: false,
      count: "???",
      firstAt: "???",
      evolves_to: []
    };
    this.state = {
      flip: false,
      modal: false,
      sortSelect: "",
      orderSelect: 1,
      filterSelect: "",
      filterOptionSelect: "",
      modalPokemon: this.defaultPokemon,
      before: true,
      evolving: false,
      success: false
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
    // this.setState({ flip: !this.state.flip });
    // console.log(i);
    this.setState({ modal: i });
  }

  handleClickOpen(i) {
    // console.log(i);
    if (i >= 0 && i < this.props.pokemons.length) {
      clearTimeout(this.modalTimeout);
      this.setState({ modal: true, modalPokemon: this.props.pokemons[i] });
    }
  }
  handleClose() {
    this.setState({
      modal: false,
      before: true,
      evolving: false,
      success: false
    });
    this.modalTimeout = setTimeout(() => {
      this.setState({ modalPokemon: this.defaultPokemon });
    }, 1000);
    clearTimeout(this.evolveTimeout);
  }

  handleSubmit() {
    if (this.state.modalPokemon.pokemonId > 0) {
      this.prevPokemon = this.state.modalPokemon;
      this.setState({
        modalPokemon: this.defaultPokemon,
        before: false,
        evolving: true,
        success: false
      });
      Meteor.call(
        "pokemon.evolve",
        this.state.modalPokemon.pokemonId,
        (err, res) => {
          if (err) {
            console.log(err);
            this.setState({
              modalPokemon: this.defaultPokemon,
              before: false,
              evolving: false,
              success: false
            });
          }
          if (res) {
            // console.log(res);
            this.evolveTimeout = setTimeout(() => {
              this.setState({
                modalPokemon: res,
                before: false,
                evolving: false,
                success: true
              });
            }, 1000);
          }
        }
      );
    }
  }

  evolved() {
    this.setState({
      ["pokemon.reveal"]: true
    });
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
    clearTimeout(this.evolveTimeout);
    clearTimeout(this.modalTimeout);
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

  padZero = (num, padlen, padchar) => {
    let pad_char = typeof padchar !== "undefined" ? padchar : "0";
    let pad_len = typeof padlen !== "undefined" ? padlen : 3;
    let pad = new Array(1 + pad_len).join(pad_char);
    return "#" + (pad + num).slice(-pad.length);
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
                    <GridItem xs={8} sm={6} md={6} lg={6}>
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
                    <GridItem xs={4} sm={6} md={6} lg={6}>
                      {this.state.orderSelect === 1 && (
                        <Button
                          color="primary"
                          justIcon
                          round
                          className={classes.orderButton}
                          onClick={this.handleOrder.bind(this)}
                          aria-label={"order"}
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

  renderLoading() {
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
              onClick={() => this.handleClickOpen(idx)}
              star={pokemon.legendary}
              collection
              pointer
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

  renderModal(classes) {
    const pokemon = this.state.modalPokemon;
    const can_evolve = pokemon.evolves_to.length > 0;
    const disable = pokemon.count < 3;

    const types = pokemon.type.map((el, idx) => (
      <Badge color={el} key={idx}>
        {el}
      </Badge>
    ));

    return (
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal
        }}
        open={this.state.modal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => this.handleClose()}
        aria-labelledby={"collection-modal"}
        aria-describedby={pokemon.name + " with ID of " + pokemon.pokemonId}
      >
        <DialogTitle
          id="collection-modal"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={() => this.handleClose()}
          >
            <Close className={classes.modalClose} />
          </Button>
          <CardAvatar profile>
            <EvolveColCard
              idx={pokemon.pokemonId}
              name={pokemon.name}
              star={pokemon.legendary}
              noTopMargin
              before={this.state.before}
              evolving={this.state.evolving}
              success={this.state.success}
              shadow
            />
          </CardAvatar>
          {/*<h4 className={classes.modalTitle}>
            {this.padZero(pokemon.pokemonId) + "\t " + pokemon.name_en}
          </h4>*/}
        </DialogTitle>
        <DialogContent
          id="collection-modal-description"
          className={classes.modalNoTopBody}
        >
          <h6 className={classes.cardCategory}>
            {this.padZero(pokemon.pokemonId)}
          </h6>
          <h4 className={classes.cardTitle}>{pokemon.name_en}</h4>
          {types}
          <GridContainer justify="center" className={classes.modalP}>
            <GridItem xs={12} sm={6} md={6} lg={6}>
              <p>{"Count: " + pokemon.count}</p>
              <p>
                {"Debut Time: "}
                {pokemon.firstAt === "???" ? (
                  "???"
                ) : (
                  <TimeAgo date={pokemon.firstAt} />
                )}
              </p>
            </GridItem>
          </GridContainer>
          {/*<p>{"Count: " + pokemon.count}</p>
          <p>
            {"Matched at: "}
            <TimeAgo date={pokemon.firstAt} />
          </p>
          <p className={classes.description}>
            Don't be scared of the truth because we need to restart the human
            foundation in truth And I love you like Kanye loves Kanye I love
            Rick Owens’ bed design but the back is...
          </p>
          <Button color="rose" round>
            Follow
          </Button>*/}
        </DialogContent>
        <DialogActions
          className={classes.modalFooter + " " + classes.modalFooterCenter}
        >
          {can_evolve && (
            <Button
              onClick={() => this.handleSubmit()}
              color="primary"
              round
              disabled={disable}
            >
              Evolve
            </Button>
          )}

          <Button onClick={() => this.handleClose()} color="primary" simple>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  loadFunction() {
    if (this.props.pokemons.length === stateDict.get("limit")) {
      stateDict.set("limit", stateDict.get("limit") + 18);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.renderSelection(classes)}
        {this.renderCards(classes)}
        {this.renderLoading(classes)}
        {this.renderModal(classes)}
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
