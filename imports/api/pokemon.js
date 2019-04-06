import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import axios from "axios";

export const Pokemon = new Mongo.Collection("pokemon");
export const Collect = new Mongo.Collection("collect");

const total = 4;
const timeouts = [];
const legendary = new Set([
  144,
  145,
  146,
  150,
  /*generation i (4)*/
  243,
  244,
  245,
  249,
  250,
  /*generation ii (9)*/
  377,
  378,
  379,
  380,
  381,
  382,
  383,
  384,
  /*generation iii (17)*/
  480,
  481,
  482,
  483,
  484,
  485,
  486,
  487,
  488,
  /*generation iv (26)*/
  638,
  639,
  640,
  641,
  642,
  643,
  644,
  645,
  646,
  /*generation v (35)*/
  716,
  717,
  718
  /*generation vi (38)*/
]);
const mythical = new Set([
  151,
  /*generation i (1)*/
  251,
  /*generation ii (1)*/
  385,
  386,
  /*generation iii (2)*/
  489,
  490,
  491,
  492,
  493,
  /*generation iv (5)*/
  494,
  647,
  648,
  649,
  /*generation v (4)*/
  719,
  720,
  721
  /*generation vi (4)*/
]);

function shuffle(array) {
  let ctr = array.length,
    temp,
    index;
  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = array[ctr];
    array[ctr] = array[index];
    array[index] = temp;
  }
  return array;
}

function searchTree(chain, name) {
  if (chain.species.name === name) {
    return chain.evolves_to.map(poke =>
      parseInt(poke.species.url.match(/pokemon-species\/(.*?)\//)[1])
    );
  } else if (chain.evolves_to.length !== 0) {
    let i;
    let result = undefined;
    for (i = 0; result === undefined && i < chain.evolves_to.length; i++) {
      result = searchTree(chain.evolves_to[i], name);
    }
    return result;
  }
  return [];
}

function getOne(count, prev, callback) {
  let pokeId = Math.floor(Math.random() * (721 - 1)) + 1;
  axios
    .get("https://pokeapi.co/api/v2/pokemon-species/" + pokeId.toString())
    .then(resSpecies => {
      const rate = resSpecies.data.capture_rate;
      let rand = Math.random();
      const compare = rate / 255;
      /*console.log(
        count,
        resSpecies.data.name,
        rate,
        rand <= compare,
        rand,
        compare
      );*/
      if (rand <= compare || count == 0) {
        if (rand > compare) {
          resSpecies = prev.resSpecies;
        }

        axios
          .get("https://pokeapi.co/api/v2/pokemon/" + pokeId.toString())
          .then(resType => {
            const chainUrl = resSpecies.data.evolution_chain.url;
            const chainId = parseInt(
              chainUrl.match(/evolution-chain\/(.*?)\//)[1]
            );
            axios
              .get(
                "https://pokeapi.co/api/v2/evolution-chain/" +
                  chainId.toString()
              )
              .then(resEvolve => {
                const type = resType.data.types.map(t => t.type.name);
                const evolves_to = searchTree(
                  resEvolve.data.chain,
                  resSpecies.data.name
                );
                const pokeInfo = {
                  id: resSpecies.data.id,
                  name: resSpecies.data.name,
                  ownerId: "",
                  match: false,
                  color: resSpecies.data.color.name,
                  type: type,
                  rate: rate,
                  legendary:
                    legendary.has(resSpecies.data.id) ||
                    mythical.has(resSpecies.data.id),
                  evolves_to: evolves_to
                };

                callback(pokeInfo);
              });
          });

        // return now;
      } else {
        let next = {
          rate: rate,
          resSpecies: resSpecies
        };

        if (prev !== undefined && prev.rate > rate) {
          next = prev;
        }

        getOne(count - 1, next, callback);
      }
    });
}

async function getByRarity(n, callback) {
  // console.log(callback);
  for (let i = 0; i < n / 2; i++) {
    getOne(3, undefined, callback);
  }
}

async function init() {
  if (Meteor.isServer) {
    let count = 0;
    let matrix = [];
    Pokemon.update({}, { count: count, board: matrix });
    /*let i = 0;
    while (i < total / 2) {
      let now = Math.floor(Math.random() * (721 - 1)) + 1;
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
      }
    });
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

    let key = "board." + index.toString() + ".ownerId";
    //console.log(key);
    let count = Pokemon.findOne({}).count;
    let board = Pokemon.findOne({}).board;
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
      }, 5000);
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
        let owner = Collect.findOne({ _id: this.userId });
        if (owner == undefined) {
          Collect.insert({ _id: this.userId, collect: [] });
        }
        let collect = Collect.findOne({ _id: this.userId }).collect;
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
        }, 5000);
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
        }, 5000);
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
      }, 5000);
    }

    if (count == total) {
      Meteor.setTimeout(function restart() {
        init();
      }, 5000);
    }
  }
});
