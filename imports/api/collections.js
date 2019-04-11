import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Counts } from "meteor/tmeasday:publish-counts";

export const Collections = new Mongo.Collection("collections");

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
          ["all", "color", "type", "can_evolve", "legendary"].indexOf(
            value
          ) >= 0
      )
    );
    check(filterKey, Match.OneOf(Boolean, String));
    check(
      sortBy,
      Match.Where(
        value =>
          [
            "pokemonId",
            "name_en",
            "rate",
            "firstAt",
            "count"
          ].indexOf(value) >= 0
      )
    );
    check(order, Match.Where(value => [-1, 1].indexOf(value) >= 0));
    check(limit, Match.Where(value => value >= 0 && value < 1000));

    let findKey;
    if (filterBy === "all") {
      findKey = { ownerId: this.userId };
    } else {
      if (filterBy === "can_evolve") {
        findKey = {
          ownerId: this.userId,
          count: { $gte: 3 },
          "evolves_to.0": { $exists: true }
        };
      } else {
        findKey = { ownerId: this.userId, [filterBy]: filterKey };
      }
    }

    let sortKey;
    if (sortBy === "rate") {
      sortKey = { rate: -order, pokemonId: order };
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
}
