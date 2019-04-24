import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";

import "../imports/api/pokemon.js";
import "../imports/api/collections.js";
import "../imports/api/avatar.js";
import "../imports/modules/server/rate-limit.js";

Meteor.startup(() => {
  WebApp.addHtmlAttributeHook(() => ({ lang: "en" }));
});
