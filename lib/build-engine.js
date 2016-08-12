const ProgressPromise = require("./progress-promise");
const strategies = require("./strategy-registry");

module.exports.make = function (solution) {
    if (typeof solution !== "object" || solution == null) {
      throw new Error("build-engine#make(): argument 'solution' must be a non-null Object.");
    }

    if (solution.hasOwnProperty("targetVersion") === false || solution.targetVersion == null || semver.valid(solution.targetVersion) == null) {
      throw new Error("build-engine#make(): argument 'solution' does not contain the required property 'targetVersion' or value does not conform to semantic version specification.");
    }


  }
};

module.exports.unmake = function (files) => {
  throw new Error("Not implemented");
};