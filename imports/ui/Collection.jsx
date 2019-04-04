import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Collect } from "../api/pokemon.js";
import PropTypes from "prop-types";

class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  redraw() {
    console.log(this.props.collect);
    for (var i = 0;i<1;i++) {
      var elem = document.createElement("button");
      elem.setAttribute("id", "button");
      elem.setAttribute("type", "button");
      elem.setAttribute("className", "btn btn-primary");
      
      elem.onclick = this.onClick.bind(this);
      document.getElementById("row").appendChild(elem);
    }
  }
    
  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
  }

  onClick(evt) {
    var elem = document.getElementById("button");
    elem.onclick = null;
    console.log(this.props.collect);
    for (var i = 0;i<this.props.collect.collect.length;i++) {
      var elem = document.createElement("img");
      elem.setAttribute("src", this.props.collect.collect[i].pict);
      document.getElementById("row").appendChild(elem);
    }
  }

  render() {
    return (
      <div>
        <div>Playing as {Meteor.user().username}</div>
        <div className="row" id="row"></div>
      </div>
      
    );
  }
}

export default withTracker(() => {
  const handle = Meteor.subscribe("collect");
  return {
    ready : handle.ready(),
    collect: Collect.findOne({})
  };
})(Collection);







