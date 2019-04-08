import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.methods({
  "avatar.change"(id) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    check(id, Number);
    const name = "pikachu";
    Meteor.users.update({ _id: this.userId }, { $set: { avatarName: name } });
  }
});
