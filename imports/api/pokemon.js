import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import axios from "axios";

export const Pokemon = new Mongo.Collection("pokemon");
export const Collect = new Mongo.Collection("collect");
const total = 10;
function shuffle(arra1) {
  var ctr = arra1.length,
    temp,
    index;
  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}
function init() {
  if (Meteor.isServer) {
    var count = 0;
    var matrix = [];
    for (var i = 0; i < total / 2; i++) {
      var now = Math.floor(Math.random() * (721 - 1)) + 1;
      matrix.push(now);
      matrix.push(now);
    }
    matrix = shuffle(matrix);
    Pokemon.update({}, { count: count, board: matrix });
    for (let i = 0; i < matrix.length; i++) {
      var tmp = matrix[i];
      axios
        .get("https://pokeapi.co/api/v2/pokemon-species/" + tmp.toString())
        .then(data => {
          var key = "board." + i.toString();
          //console.log(key);
          Pokemon.update(
            {},
            {
              $set: {
                [key]: {
                  id: data.data.id,
                  /*pict: data.data.sprites.front_default,*/
                  name: data.data.name,
                  user: ""
                }
              }
            }
          );
        });
    }
  } else {
    throw new Meteor.Error("not-server");
  }
}
if (Meteor.isServer) {
  if (Pokemon.find({}) == undefined || Pokemon.find({}).count() == 0) {
    Pokemon.insert({ count: 0, board: [] });
  }
  init();
  Meteor.publish("pokemon", function Publish() {
    // console.log(Pokemon.find({}));
    // var board = Pokemon.find({}).board;
    // for (var i = 0;i<board.length;i++) {
    //   for (var j = 0;j<board[i].length;j++){
    //     board[i][j] = {id:0, pict:"", name:"", user:board[i][j].user};
    //   }
    // }
    // console.log({board});
    // return {board};
    return Pokemon.find({}, { board: 0 });
  });
  Meteor.publish("collect", function Publish() {
    return Collect.find({ _id: this.userId });
  });
}

Meteor.methods({
  "pokemon.flip"(index) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    if (!Meteor.isServer) {
      return;
    }
    check(index, Number);
    var key = "board." + index.toString() + ".user";
    //console.log(key);
    var count = Pokemon.findOne({}).count;
    var board = Pokemon.findOne({}).board;
    if (board[index].user != "") {
      return;
    }
    Pokemon.update(
      {},
      {
        $set: {
          [key]: this.userId
        }
      }
    );
    for (let i = 0; i < board.length; i++) {
      if (
        board[i].id == board[index].id &&
        board[i].user == this.userId &&
        i != index
      ) {
        //flip it back

        key = "board." + i.toString() + ".user";

        Pokemon.update(
          {},
          {
            $set: {
              [key]: "done"
            }
          }
        );
        key = "board." + index.toString() + ".user";

        Pokemon.update(
          {},
          {
            $set: {
              [key]: "done"
            }
          }
        );
        var user = Collect.findOne({ _id: this.userId });
        if (user == undefined) {
          Collect.insert({ _id: this.userId, collect: [] });
        }
        var collect = Collect.findOne({ _id: this.userId }).collect;
        collect.push(board[i]);
        Collect.update({ _id: this.userId }, { collect: collect });

        count += 2;
        Pokemon.update(
          {},
          {
            $set: {
              count: count
            }
          }
        );
      }
    }

    board = Pokemon.findOne({}).board;
    var nowFlip = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i].user == this.userId) {
        nowFlip.push(i);
      }
    }
    if (nowFlip.length >= 3) {
      //flip it back after 3 times
      for (let i = 0; i < nowFlip.length; i++) {
        key = "board." + nowFlip[i].toString() + ".user";
        Pokemon.update(
          {},
          {
            $set: {
              [key]: ""
            }
          }
        );
      }
    } else {
      Meteor.setTimeout(function flipBack() {
        //flip it back after 5 seconds
        board = Pokemon.findOne({}).board;
        if (board[index].user != "done") {
          key = "board." + index.toString() + ".user";
          Pokemon.update(
            {},
            {
              $set: {
                [key]: ""
              }
            }
          );
        }
      }, 3000);
    }

    nowFlip = [];
    if (count == total) {
      init();
    }
  }
});
