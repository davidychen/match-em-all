import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import axios from "axios";

import { Collections } from "./collections.js";

export const Board = new Mongo.Collection("board");
export const MatchPlayers = new Mongo.Collection("match-players");
export const Message = new Mongo.Collection("message");

export const Daily = new Mongo.Collection("daily");
export const Types = new Mongo.Collection("types");
export const Rarity = new Mongo.Collection("rarity");

export const Pokemon = new Mongo.Collection("pokemon");
export const Collect = new Mongo.Collection("collect");

const total = 36;
let gamePokes = [];
const timeouts = {};
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
    Board.remove({ index: { $exists: true } }, () => {
      gamePokes = [];
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
        Meteor.setTimeout(function restart() {
          init();
        }, 5000);
      }
    }
  }
  /*"game.login"() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    console.log("IN");
    const avatarId = Meteor.user().profile
      ? Meteor.user().profile.avatarId
      : undefined;
    Players.upsert(
      {
        userId: this.userId,
        username: Meteor.user().username,
        avatarId: avatarId
      },
      { $set: { when: new Date() } }
    );
  },
  "game.logout"() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    console.log("OUT");
    Players.remove({ userId: this.userId, username: Meteor.user().username });
  }*/
});
