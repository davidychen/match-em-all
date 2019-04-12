import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import Select from "react-select";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Collections } from "../../../api/collections.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
/*import PictureUpload from "../../components/CustomUpload/PictureUpload.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";*/
// core components
import Button from "../../components/CustomButtons/Button.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";

import profilePageStyle from "../../assets/jss/material-dashboard-pro-react/views/profilePageStyle.jsx";

class PropfilePage extends React.Component {
  constructor(props) {
    super(props);
    const avatarId = this.props.avatarId;
    this.state = {
      imagePreviewUrl: this.getLink(avatarId),
      altName: this.getAltName(avatarId),
      id: avatarId || 0,
      selectedOption: this.getOption(avatarId),
      succeeded: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.lastPropId = avatarId || 0;
  }

  getLink(id) {
    if (id && id > 0 && id < 1000) {
      return (
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
        id +
        ".png"
      );
    } else {
      return "/default-avatar.png";
    }
  }

  getAltName(id) {
    if (id && id > 0 && id < 1000) {
      return "avatar " + id;
    } else {
      return "default avatar";
    }
  }

  getOption(id) {
    if (id && id > 0 && id < 1000) {
      if (this.props.avatars) {
        const found =
          this.props.avatars &&
          this.props.avatars.find(el => {
            return el.pokemonId === id;
          });
        if (found) {
          return { value: found.pokemonId, label: found.name_en };
        }
      }
    }
    return { value: 0, label: "Default" };
  }

  handleChange = selectedOption => {
    if (selectedOption.value !== this.state.id) {
      const id = selectedOption.value;
      this.setState({
        imagePreviewUrl: this.getLink(id),
        altName: this.getAltName(id),
        id: id,
        selectedOption: selectedOption,
        succeeded: false
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.id > 0) {
      Meteor.call("avatar.change", this.state.id);
    }
  }

  update() {
    const avatarId = this.props.avatarId || 0;
    if (this.props.ready && avatarId !== this.lastPropId) {
      this.setState({
        imagePreviewUrl: this.getLink(avatarId),
        altName: this.getAltName(avatarId),
        id: avatarId,
        selectedOption: this.getOption(avatarId),
        succeeded: true
      });
      this.lastPropId = avatarId;
    }
  }

  componentDidMount() {
    this.update();
  }
  componentDidUpdate() {
    this.update();
  }

  render() {
    const { classes, avatars, user, avatarId } = this.props;
    const options = avatars.map(el => {
      return { value: el.pokemonId, label: el.name_en };
    });
    options.unshift({ value: 0, label: "Default" });
    const { selectedOption } = this.state;
    const containerClasses = cx({
      [classes.profileContainer]: true,
      [classes.succeeded]: this.state.succeeded
    });
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={8}>
          <Card className={classes.card}>
            <div className={classes.wizardHeader}>
              <h3 className={classes.title}>Your Profile</h3>
              <h5 className={classes.subtitle}>
                You can make changes to your profile.
              </h5>
            </div>
            <div className={classes.content}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={4}>
                  <div className={containerClasses + " picture-container"}>
                    <div className={classes.profilePicture + " picture"}>
                      <img
                        src={this.state.imagePreviewUrl}
                        className="picture-src"
                        alt={this.state.altName}
                      />
                    </div>
                  </div>
                </GridItem>
                {/*defaultValue={this.state.selectedOption}
              value={selectedOption}*/}
                <GridItem xs={12} sm={6}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={
                      !this.props.ready || this.props.avatars.length === 0
                    }
                    isLoading={!this.props.ready}
                    isClearable={true}
                    isSearchable={true}
                    placeholder={"Select..."}
                    onChange={this.handleChange}
                    name="avatar"
                    options={options}
                  />
                  <Button
                    color="primary"
                    className={""}
                    onClick={this.handleSubmit}
                    fullWidth
                  >
                    Save Avatar
                  </Button>
                  {/*2 inputs here, porps : fullWidth : true*/}
                </GridItem>
                {/*<GridItem xs={12} sm={12} md={12} lg={10}>
  <Button color="rose" className={""} onClick={() => this.handleSubmit}>
    Save
  </Button>
</GridItem>;*/}
              </GridContainer>
            </div>
          </Card>
          {/*<Wizard
            validate
            steps={[
              { stepName: "About", stepComponent: Step1, stepId: "about" },
              { stepName: "Account", stepComponent: Step2, stepId: "account" },
              { stepName: "Address", stepComponent: Step3, stepId: "address" }
            ]}
            title="Build Your Profile"
            subtitle="This information will let us know more about you."
            finishButtonClick={e => console.log(e)}
          />*/}
        </GridItem>
      </GridContainer>
    );
  }
}

PropfilePage.propTypes = {
  classes: PropTypes.object,
  avatarId: PropTypes.number,
  avatars: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  ready: PropTypes.bool
};

export default withTracker(() => {
  const handle = Meteor.subscribe("avatar-ids");
  const user = Meteor.user();
  return {
    avatars: Collections.find({}).fetch(),
    ready: handle.ready(),
    user: user,
    avatarId: user && user.profile && user.profile.avatarId
  };
})(withStyles(profilePageStyle)(PropfilePage));
