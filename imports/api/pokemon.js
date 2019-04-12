import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import axios from "axios";
import moment from "moment";

import { Collections } from "./collections.js";

export const Board = new Mongo.Collection("board");
export const MatchPlayers = new Mongo.Collection("match-players");
export const Message = new Mongo.Collection("message");

export const Daily = new Mongo.Collection("daily");
export const Types = new Mongo.Collection("types");

export const Pokemon = new Mongo.Collection("pokemon");

const total = 36;
let gamePokes = [];
const timeouts = {};
let initTimeout;
const apiTimeouts = {};
// let startTime = new Date();
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

// type with colors
const TYPES = {
  normal: { typeId: 1, type_color: "#A8A878" },
  fighting: { typeId: 2, type_color: "#C03028" },
  flying: { typeId: 3, type_color: "#A890F0" },
  poison: { typeId: 4, type_color: "#A040A0" },
  ground: { typeId: 5, type_color: "#E0C068" },
  rock: { typeId: 6, type_color: "#B8A038" },
  bug: { typeId: 7, type_color: "#A8B820" },
  ghost: { typeId: 8, type_color: "#705898" },
  steel: { typeId: 9, type_color: "#B8B8D0" },
  fire: { typeId: 10, type_color: "#F08030" },
  water: { typeId: 11, type_color: "#6890F0" },
  grass: { typeId: 12, type_color: "#78C850" },
  electric: { typeId: 13, type_color: "#F8D030" },
  psychic: { typeId: 14, type_color: "#F85888" },
  ice: { typeId: 15, type_color: "#98D8D8" },
  dragon: { typeId: 16, type_color: "#7038F8" },
  dark: { typeId: 17, type_color: "#705848" },
  fairy: { typeId: 18, type_color: "#EE99AC" },
  unknown: { typeId: 19, type_color: "#68A090" },
  shadow: { typeId: 20, type_color: "#604E82" }
};

// shuffle all cards!
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

// search in a evolution-chain and find all pokemons that it can evolve to :)
function searchTree(chain, name) {
  if (chain.species.name === name) {
    return chain.evolves_to.map(poke => {
      return {
        pokemonId: parseInt(
          poke.species.url.match(/pokemon-species\/(.*?)\//)[1]
        ),
        name: poke.species.name
      };
    });
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

// get one pokemon by getting catching rate and if not pass test, rerun!
// using pokeapi.co: pokemon-species and pokemon
// to get types & color & ...
function getOne(count, prev, i, callback) {
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
                const name_en = resSpecies.data.names.filter(
                  name => name.language.name === "en"
                )[0].name;
                const pokeInfo = {
                  id: resSpecies.data.id,
                  name: resSpecies.data.name,
                  name_en: name_en,
                  color: resSpecies.data.color.name,
                  type: type,
                  rate: rate,
                  legendary:
                    legendary.has(resSpecies.data.id) ||
                    mythical.has(resSpecies.data.id),
                  evolves_to: evolves_to
                };

                callback(pokeInfo);
              })
              .catch(error => {
                console.log(error);
                Meteor.clearTimeout(apiTimeouts[i]);
                apiTimeouts[i] = Meteor.setTimeout(function restart() {
                  getOne(count, prev, i, callback);
                }, 5000);
              });
          })
          .catch(error => {
            console.log(error);
            Meteor.clearTimeout(apiTimeouts[i]);
            apiTimeouts[i] = Meteor.setTimeout(function restart() {
              getOne(count, prev, i, callback);
            }, 5000);
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

        getOne(count - 1, next, i, callback);
      }
    })
    .catch(error => {
      console.log(error);
      Meteor.clearTimeout(apiTimeouts[i]);
      apiTimeouts[i] = Meteor.setTimeout(function restart() {
        getOne(count, prev, i, callback);
      }, 5000);
    });
}

// Run 3 times and push the pokemon into board!
async function getByRarity(n, callback) {
  // console.log(callback);
  for (let i = 0; i < n / 2; i++) {
    getOne(3, undefined, i, callback);
  }
}
// Initiate Game with considering API limit: 100 API requests per IP address per minute
//  (https://pokeapi.co/docs/v2.html)
// Get pokemons by their rarity.. :)
async function init() {
  if (Meteor.isServer) {
    Board.remove({ _id: { $exists: true } }, () => {
      gamePokes = [];
      /*const timeNow = new Date();
      if (timeNow - startTime <= 60000) {
        Meteor.clearTimeout(initTimeout);
        initTimeout = Meteor.setTimeout(function restart() {
          init();
        }, 5000);
      }*/
      getByRarity(total, n => {
        gamePokes.push(n);
        gamePokes.push(n);
        if (gamePokes.length == total) {
          // console.log(matrix);
          gamePokes = shuffle(gamePokes);
          gamePokes.forEach((poke, i) => {
            Board.insert({ index: i, match: false });
          });
        }
      });
    });
    MatchPlayers.remove({});
  } else {
    throw new Meteor.Error("not-server");
  }
}

if (Meteor.isServer) {
  // console.log("date", new Date());
  // console.log("momenttype", moment().startOf("day").toDate());
  // console.log("momenttype", moment().startOf("day").subtract(7, "days").toDate());
  init();
  Meteor.publish("board", function boardPublish() {
    return Board.find({}, { sort: { index: 1 } });
  });
  Meteor.publish("players", function playerPublish() {
    return [
      Meteor.users.find(
        { "status.online": true },
        {
          fields: {
            username: true,
            "profile.avatarId": true,
            "status.lastLogin.date": true
          },
          sort: { "status.lastLogin.date": 1 }
        }
      ),
      MatchPlayers.find({})
    ];
  });
  Meteor.publish("daily", function dailyPublish() {
    return Daily.find(
      {
        date: {
          $gt: moment()
            .endOf("day")
            .subtract(7, "days")
            .toDate()
        }
      },
      { sort: { date: 1 } }
    );
  });
  Meteor.publish("types", function typesPublish() {
    return Types.find({}, { sort: { typeId: 1 } });
  });
}

function flipBackTimeout(index, userId) {
  return Meteor.setTimeout(function flipBack() {
    //flip it back after 5 seconds
    Board.update(
      { index: index, ownerId: userId, match: false },
      { $unset: { pokemon: 1, ownerId: 1 } }
    );
  }, 5000);
}

Meteor.methods({
  // card flip with all game logics behind
  "card.flip"(index) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(index, Number);
    if (Meteor.isServer) {
      if (index >= total || index < 0 || Math.floor(index) !== index) {
        throw new Meteor.Error("wrong-index");
      }
      const docs = Board.update(
        { index: index, ownerId: { $exists: false }, match: false },
        { $set: { ownerId: this.userId, pokemon: gamePokes[index] } }
      );
      if (docs < 1) {
        return;
      }
      const found = Board.find({
        index: { $ne: index },
        ownerId: this.userId,
        match: false
      }).fetch();
      // Flip back all if >= 2 found
      if (found.length >= 2) {
        found.forEach(card => {
          const i = card.index;
          Meteor.clearTimeout(timeouts[i]);
          Board.update(
            { index: i, ownerId: this.userId, match: false },
            { $unset: { ownerId: 1, pokemon: 1 } }
          );
        });
        timeouts[index] = flipBackTimeout(index, this.userId);
      }
      // need to match
      else if (found.length === 1) {
        const i = found[0].index;
        Meteor.clearTimeout(timeouts[i]);
        // MATCH !!!
        if (gamePokes[i].id === gamePokes[index].id) {
          const match = [i, index];
          match.forEach(idx => {
            Board.update(
              { index: idx, ownerId: this.userId, match: false },
              {
                $set: {
                  ownerId: this.userId,
                  match: true,
                  pokemon: gamePokes[idx],
                  matchAt: new Date(),
                  ownerName: Meteor.user().username
                }
              }
            );
          });
          MatchPlayers.update(
            { ownerId: this.userId },
            {
              $inc: { count: 1 },
              $set: { pokemon: gamePokes[index].name_en, matchAt: new Date() }
            },
            { upsert: true }
          );
          Collections.update(
            {
              ownerId: this.userId,
              pokemonId: gamePokes[index].id
            },
            {
              $inc: { count: 1 },
              $setOnInsert: {
                id: gamePokes[index].id,
                name: gamePokes[index].name,
                name_en: gamePokes[index].name_en,
                color: gamePokes[index].color,
                type: gamePokes[index].type,
                rate: gamePokes[index].rate,
                legendary: gamePokes[index].legendary,
                evolves_to: gamePokes[index].evolves_to,
                firstAt: new Date()
              }
            },
            { upsert: true }
          );
          Daily.update(
            {
              date: moment()
                .startOf("day")
                .toDate()
            },
            {
              $inc: { count: 1 },
              $setOnInsert: {
                day: moment().day()
              }
            },
            { upsert: true }
          );
          const types = gamePokes[index].type;
          const count = types.length === 0 ? 0 : 1 / types.length;
          types.forEach(type =>
            Types.update(
              { type: type },
              {
                $inc: { count: count },
                $setOnInsert: {
                  typeId: TYPES[type].typeId,
                  type_color: TYPES[type].type_color
                }
              },
              { upsert: true }
            )
          );
        }
        // NOT MATCH ...
        else {
          timeouts[index] = flipBackTimeout(index, this.userId);
          timeouts[i] = flipBackTimeout(i, this.userId);
        }
      }
      // no match
      else {
        Meteor.clearTimeout(timeouts[index]);
        timeouts[index] = flipBackTimeout(index, this.userId);
      }
      const matched = Board.find({ match: true }).fetch().length;
      if (matched === total) {
        Meteor.clearTimeout(initTimeout);
        initTimeout = Meteor.setTimeout(function restart() {
          init();
        }, 5000);
      }
    }
  }
});
