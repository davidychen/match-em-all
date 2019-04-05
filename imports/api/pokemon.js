import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import axios from "axios";

export const Pokemon = new Mongo.Collection("pokemon");
export const Collect = new Mongo.Collection("collect");
const total = 36;
const timeouts = [];
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

function getOne(count, callback) {
  var now = Math.floor(Math.random() * (721 - 1)) + 1;
  if (count == 0) return now;
  axios
    .get("https://pokeapi.co/api/v2/pokemon-species/" + now.toString())
    .then(data => {
      const rate = data.data.capture_rate;
      var rand = Math.floor(Math.random() * 65536);
      const compare =
        (Math.pow(2, 20) - Math.pow(2, 4)) /
        Math.sqrt(Math.sqrt((Math.pow(2, 24) - Math.pow(2, 16)) / rate));
      // console.log(count, rand <= compare, rand, compare);
      if (rand <= compare) {
        callback(now);
        // return now;
      } else {
        getOne(count - 1, callback);
      }
    });
}
async function getByRarity(n, callback) {
  // console.log(callback);
  for (let i = 0; i < n / 2; i++) {
    getOne(5, callback);
  }
}
async function init() {
  if (Meteor.isServer) {
    var count = 0;
    var matrix = [];
    Pokemon.update({}, { count: count, board: matrix });
    /*let i = 0;
    while (i < total / 2) {
      var now = Math.floor(Math.random() * (721 - 1)) + 1;
      matrix.push(now);
      matrix.push(now);
      i++;
    }
    let matrix = [];*/
    getByRarity(total, n => {
      matrix.push(n);
      matrix.push(n);
      if (matrix.length == total) {
        // console.log(matrix);
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
                      name: data.data.name,
                      ownerId: "",
                      match: false
                    }
                  }
                }
              );
            });
        }
      }
    });

    /*matrix = shuffle(matrix);
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
                  name: data.data.name,
                  ownerId: "",
                  match: false
                }
              }
            }
          );
        });
    }*/
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

    var key = "board." + index.toString() + ".ownerId";
    //console.log(key);
    var count = Pokemon.findOne({}).count;
    var board = Pokemon.findOne({}).board;
    if (board[index].ownerId !== "") {
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
    // Find a matched card
    let foundSelect = [];
    for (let i = 0; i < board.length; i++) {
      if (
        /*board[i].id == board[index].id &&*/
        board[i].ownerId == this.userId &&
        !board[i].match &&
        i != index
      ) {
        foundSelect.push(i);
      }
    }
    // Already 2 selected
    if (foundSelect.length === 2) {
      foundSelect.forEach(i => {
        Meteor.clearTimeout(timeouts[i]);
        key = "board." + i.toString() + ".ownerId";
        Pokemon.update(
          {},
          {
            $set: {
              [key]: ""
            }
          }
        );
      });
      timeouts[index] = Meteor.setTimeout(function flipBack() {
        //flip it back after 5 seconds
        board = Pokemon.findOne({}).board;
        if (!board[index].match) {
          key = "board." + index.toString() + ".ownerId";
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
    } else if (foundSelect.length === 1) {
      const i = foundSelect[0];
      //find two match
      if (board[i].id == board[index].id) {
        key = "board." + i.toString() + ".match";

        Pokemon.update(
          {},
          {
            $set: {
              [key]: true
            }
          }
        );
        key = "board." + index.toString() + ".match";

        Pokemon.update(
          {},
          {
            $set: {
              [key]: true
            }
          }
        );
        var owner = Collect.findOne({ _id: this.userId });
        if (owner == undefined) {
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
      } else {
        // Not Match
        if (i in timeouts) {
          Meteor.clearTimeout(timeouts[i]);
        }
        timeouts[i] = Meteor.setTimeout(function flipBack() {
          //flip it back after 5 seconds
          board = Pokemon.findOne({}).board;
          if (!board[i].match) {
            key = "board." + i.toString() + ".ownerId";
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
        timeouts[index] = Meteor.setTimeout(function flipBack() {
          //flip it back after 5 seconds
          board = Pokemon.findOne({}).board;
          if (!board[index].match) {
            key = "board." + index.toString() + ".ownerId";
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
    } else {
      // no flip yet
      timeouts[index] = Meteor.setTimeout(function flipBack() {
        //flip it back after 5 seconds
        board = Pokemon.findOne({}).board;
        if (!board[index].match) {
          key = "board." + index.toString() + ".ownerId";
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

    /*board = Pokemon.findOne({}).board;
    var nowFlip = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i].ownerId == this.userId && !board[i].match) {
        nowFlip.push(i);
      }
    }
    if (nowFlip.length >= 4) {
      //flip it back after 3 times
      for (let i = 0; i < nowFlip.length; i++) {
        key = "board." + nowFlip[i].toString() + ".ownerId";
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
      timeouts[index] = Meteor.setTimeout(function flipBack() {
        //flip it back after 5 seconds
        board = Pokemon.findOne({}).board;
        if (!board[index].match) {
          key = "board." + index.toString() + ".ownerId";
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

    nowFlip = [];*/
    if (count == total) {
      Meteor.setTimeout(function restart() {
        init();
      }, 5000);
    }
  }
});
