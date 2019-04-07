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
                const name_en = resSpecies.data.names.filter(name => name.language.name === "en")[0].name;
                const pokeInfo = {
                  id: resSpecies.data.id,
                  name: resSpecies.data.name,
                  name_en: name_en,
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
    Pokemon.update({}, { count: count, game: [], board: [] });

    getByRarity(total, n => {
      matrix.push(n);
      matrix.push(n);
      if (matrix.length == total) {
        // console.log(matrix);
        matrix = shuffle(matrix);
        const board = Array(total).fill({ match: false });
        Pokemon.update({}, { count: count, game: matrix, board: board });
      }
    });
  } else {
    throw new Meteor.Error("not-server");
  }
}

if (Meteor.isServer) {
  if (Pokemon.find({}) == undefined || Pokemon.find({}).count() == 0) {
    Pokemon.insert({ count: 0, game: [], board: [] });
  }
  init(); 
  Meteor.publish("pokemon", function Publish() {
    return Pokemon.find({}, { fields: { board: 1 } });
  });
  Meteor.publish("collect", function Publish() {
    return Collect.find({ _id: this.userId });
  });
}

function flipBackTimeout(index) {
  return Meteor.setTimeout(function flipBack() {
    //flip it back after 5 seconds
    const board = Pokemon.findOne({}).board;
    if (!board[index].match) {
      const key = "board." + index.toString();
      Pokemon.update(
        {},
        {
          $set: {
            [key]: {match: false}
          }
        }
      );
    }
  }, 5000);
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

    let key = "board." + index.toString();
    //console.log(key);
    const pokedb = Pokemon.findOne({});
    let count = pokedb.count;
    let game = pokedb.game;
    let board = pokedb.board;

    // Lock this card
    if (board[index].ownerId !== undefined) {
      return;
    }
    let toReveal = game[index];
    toReveal.ownerId = this.userId;
    toReveal.match = board[index].match;

    Pokemon.update(
      {},
      {
        $set: {
          [key]: toReveal
        }
      }
    );
    // Find a matched card
    let foundSelect = [];
    for (let i = 0; i < board.length; i++) {
      if (
        /*board[i].id == board[index].id &&*/
        board[i].ownerId === this.userId &&
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
        key = "board." + i.toString();
        Pokemon.update(
          {},
          {
            $set: {
              [key]: { match: false }
            }
          }
        );
      });
      timeouts[index] = flipBackTimeout(index);
    } else if (foundSelect.length === 1) {
      const i = foundSelect[0];
      //find two match
      if (game[i].id === game[index].id) {

        key = "board." + i.toString();
        let matchCard = game[i];
        matchCard.match = true;
        matchCard.ownerId = this.userId;
        matchCard.matchAt = new Date();
        matchCard.ownerName = Meteor.user().username;

        Pokemon.update(
          {},
          {
            $set: {
              [key]: matchCard
            }
          }
        );
        key = "board." + index.toString();

        Pokemon.update(
          {},
          {
            $set: {
              [key]: matchCard
            }
          }
        );
        let owner = Collect.findOne({ _id: this.userId });
        if (owner === undefined) {
          Collect.insert({ _id: this.userId, collect: [] });
        }
        let collect = Collect.findOne({ _id: this.userId }).collect;
        collect.push(game[i]);
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
        timeouts[i] = flipBackTimeout(i);
        timeouts[index] = flipBackTimeout(index);
      }
    } else {
      // no flip yet
      timeouts[index] = flipBackTimeout(index);
    }

    if (count == total) {
      Meteor.setTimeout(function restart() {
        init();
      }, 5000);
    }
  }
});
