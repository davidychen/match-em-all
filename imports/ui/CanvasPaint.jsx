import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Pokemon } from "../api/pokemon.js";
import PropTypes from "prop-types";

const total = 10;
class CanvasPaint extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  redraw() {
    for (var i = 0;i<total;i++) {
      var elem = document.createElement("img");
      elem.setAttribute("id", "img." + i.toString());
      elem.setAttribute("src", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png");//back of the card
      elem.onclick = this.onClick.bind(this, i);
      document.getElementById("row0").appendChild(elem);
    }
  }
  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
  }

  onClick(x, evt) {
    
    Meteor.call("pokemon.flip", x);//flip x
    var img = document.getElementById("img." + x.toString());
    console.log(x);
    console.log(this.props.pokemon.board[x]);
    img.src = this.props.pokemon.board[x].pict;
  }

  render() {
    return (
      <div>
        <div>Playing as {Meteor.user().username}</div>
        <div className="row" id="row0"></div>
        
        
      </div>
      
    );
  }
}


export default withTracker(() => {
  const handle = Meteor.subscribe("pokemon");
  return {
    pokemon: Pokemon.find({}).fetch()[0],
    ready : handle.ready()
  };
})(CanvasPaint);







