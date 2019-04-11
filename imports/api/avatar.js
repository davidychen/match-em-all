import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import { Collections } from "./collections.js";

/*if (Meteor.isServer) {
  Meteor.publish("avatar", function avatarPublish() {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          username: true,
          "profile.avatarId": true
        }
      }
    );
  });
}*/

Meteor.methods({
  "avatar.change"(id) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(id, Number);
    const count = Collections.find({
      ownerId: this.userId,
      pokemonId: id
    }).count();
    if (count <= 0) {
      throw new Meteor.Error("not-available");
    } else {
      Meteor.users.update(
        { _id: this.userId },
        { $set: { avatarId: id } }
      );
    }
  }
});
