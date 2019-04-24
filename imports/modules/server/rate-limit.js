import { Meteor } from "meteor/meteor";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { _ } from "meteor/underscore";

DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
  const time = Math.ceil(timeToReset / 1000);
  const seconds = time === 1 ? "second" : "seconds";
  return `Easy on the gas, buddy. Too many requests. Try again in ${time} ${seconds}.`;
});

// const fetchMethodNames = methods => _.pluck(methods, "name");

const assignLimits = ({ methods, limit, timeRange }) => {
  // const methodNames = fetchMethodNames(methods);
  const methodNames = methods;
  DDPRateLimiter.addRule(
    {
      userId(userId) {
        const user = Meteor.users.findOne(userId);
        return user && user.type !== "admin";
      },
      type: "method",
      name(name) {
        // console.log(name, _.contains(methodNames, name));
        // console.log(methodNames);
        return methodNames.includes(name);
      }
    },
    limit,
    timeRange
  );
};

const rateLimit = options => assignLimits(options);

if (Meteor.isServer) {
  rateLimit({
    methods: ["avatar.change", "pokemon.evolve", "card.flip"],
    limit: 5,
    timeRange: 1000
  });
}
