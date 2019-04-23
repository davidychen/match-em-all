import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Counts } from "meteor/tmeasday:publish-counts";
import axios from "axios";

export const Collections = new Mongo.Collection("collections");

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

if (Meteor.isServer) {
  Meteor.publish("collections-with-count", function collectionsPublish(
    filterBy,
    filterKey,
    sortBy,
    order,
    limit
  ) {
    check(
      filterBy,
      Match.Where(
        value =>
          ["all", "color", "type", "can_evolve", "legendary"].indexOf(value) >=
          0
      )
    );
    check(filterKey, Match.OneOf(Boolean, String));
    check(
      sortBy,
      Match.Where(
        value =>
          ["pokemonId", "name_en", "rate", "firstAt", "count"].indexOf(value) >=
          0
      )
    );
    check(order, Match.Where(value => [-1, 1].indexOf(value) >= 0));
    check(limit, Match.Where(value => value >= 0 && value < 1000));

    let findKey;
    if (filterBy === "all") {
      findKey = { ownerId: this.userId, count: { $gt: 0 } };
    } else {
      if (filterBy === "can_evolve") {
        findKey = {
          ownerId: this.userId,
          count: { $gte: 3 },
          "evolves_to.0": { $exists: true }
        };
      } else {
        findKey = {
          ownerId: this.userId,
          count: { $gt: 0 },
          [filterBy]: filterKey
        };
      }
    }

    // console.log(filterBy, filterKey, sortBy, order, limit);

    let sortKey;
    if (sortBy === "rate") {
      sortKey = { legendary: order, rate: -order, pokemonId: order };
    } else if (sortBy !== "pokemonId") {
      sortKey = { [sortBy]: order, pokemonId: order };
    } else {
      sortKey = { pokemonId: order };
    }
    Counts.publish(
      this,
      "collection-filter-count",
      Collections.find(findKey, { sort: sortKey, limit: limit }),
      { noReady: true }
    );
    Counts.publish(
      this,
      "collection-total-count",
      Collections.find({ ownerId: this.userId }),
      { noReady: true }
    );
    if (limit === 0) {
      findKey["_id"] = { $exists: false };
    }

    return Collections.find(findKey, { sort: sortKey, limit: limit });
  });
  Meteor.publish("avatar-ids", function avatarIdsPublish() {
    return Collections.find(
      { ownerId: this.userId },
      {
        sort: { name_en: 1 },
        fields: { pokemonId: true, name: true, name_en: true }
      }
    );
  });
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

let apiTimeout;
// get one pokemon by getting catching rate and if not pass test, rerun!
// using pokeapi.co: pokemon-species and pokemon
// to get types & color & ...
function getById(pokeId, callback) {
  axios
    .get("https://pokeapi.co/api/v2/pokemon-species/" + pokeId.toString())
    .then(resSpecies => {
      const rate = resSpecies.data.capture_rate;
      axios
        .get("https://pokeapi.co/api/v2/pokemon/" + pokeId.toString())
        .then(resType => {
          const chainUrl = resSpecies.data.evolution_chain.url;
          const chainId = parseInt(
            chainUrl.match(/evolution-chain\/(.*?)\//)[1]
          );
          axios
            .get(
              "https://pokeapi.co/api/v2/evolution-chain/" + chainId.toString()
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
              Meteor.clearTimeout(apiTimeout);
              apiTimeout = Meteor.setTimeout(function restart() {
                getById(pokeId);
              }, 5000);
            });
        })
        .catch(error => {
          console.log(error);
          Meteor.clearTimeout(apiTimeout);
          apiTimeout = Meteor.setTimeout(function restart() {
            getById(pokeId);
          }, 5000);
        });
    })
    .catch(error => {
      console.log(error);
      Meteor.clearTimeout(apiTimeout);
      apiTimeout = Meteor.setTimeout(function restart() {
        getById(pokeId);
      }, 5000);
    });
}

Meteor.methods({
  // card flip with all game logics behind
  "pokemon.evolve"(pokemonId) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(pokemonId, Number);
    if (Meteor.isServer) {
      const pokemon = Collections.findOne({
        pokemonId: pokemonId,
        ownerId: this.userId,
        count: { $gte: 3 },
        "evolves_to.0": { $exists: true }
      });
      if (pokemon == undefined) {
        // If the pokemon is not on collection, make sure only the owner can evolve it
        throw new Meteor.Error("not-authorized");
      }
      const evolveId =
        pokemon.evolves_to[
          Math.floor(Math.random() * pokemon.evolves_to.length)
        ].pokemonId;
      Collections.update(
        {
          _id: pokemon._id
        },
        { $inc: { count: -3 } }
      );

      return new Promise((resolve, reject) => {
        getById(evolveId, pokeInfo => {
          Collections.update(
            {
              ownerId: this.userId,
              pokemonId: pokeInfo.id
            },
            {
              $inc: { count: 1 },
              $setOnInsert: {
                name: pokeInfo.name,
                name_en: pokeInfo.name_en,
                color: pokeInfo.color,
                type: pokeInfo.type,
                rate: pokeInfo.rate,
                legendary: pokeInfo.legendary,
                evolves_to: pokeInfo.evolves_to,
                firstAt: new Date()
              }
            },
            { upsert: true }
          );
          const pokeFound = Collections.findOne({
            ownerId: this.userId,
            pokemonId: pokeInfo.id
          });
          // console.log("server", pokeFound);
          resolve(pokeFound);
        });
      });
    }
  }
});
