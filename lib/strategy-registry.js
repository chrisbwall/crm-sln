const semver = require("semver");
const glob = require("glob");

const strategies = {};

/**
 * Takes SolutionData instance and makes a SolutionFiles instance 
 *   which is valid for Dynamics CRM 2011.
 * 
 * @param {Object} loosely structured solution data
 * @returns {Object} returns ProgressPromise object which resolves to a SolutionFiles instance
 */
module.exports.register = function (version, strategy) {
  version = semver.validRange(version);

  if (version == null) {
    throw new Error("StrategyRegistry#register: argument 'version' is not a valid Semver range string.");
  }

  if (strategies.hasOwnProperty(version) === true) {
    if (strategies[version] === strategy) {
      return;
    }

    throw new Error("StrategyRegistry#register: argument 'version' is already registered by another strategy.");
  }

  if (typeof strategy !== "object" || strategy == null || strategy.hasOwnProperty("validate") === false || strategy.hasOwnProperty("normalize") === false || strategy.hasOwnProperty("make") === false) {
    throw new Error("StrategyRegistry#register: argument 'strategy' must be a non-null object and contain implementations of functions named 'validate', 'normalize', and 'make'.");
  }

  Object.defineProperty(strategies, version, {
    value: Object.freeze({ range: version, strategy }),
    writable: false,
    configurable: false,
    enumerable: true
  });
};

module.exports.registerAll = function (strategyGlob) {
  if (typeof strategyGlob !== "string" || strategyGlob === "") {
    throw new Error("strategy-registry#registerAll: argument 'strategyGlob' must be a non-empty string.");
  }

  let files = glob.sync(strategyGlob);
  files.forEach(f => {
    let s = require(f);
    if (typeof s === "function") {
      s(_register);
    }
  });
};

module.exports.isRegistered = function (version) => {
  return (semver.validRange(version) != null && strategies.hasOwnProperty(semver.validRange(version)));
};

module.exports.getFor = function (version) {
  version = semver.valid(version);

  if (version == null) {
    throw new Error("strategy-registry#getFor: argument 'version' is not a valid Semver version string.");
  }

  let valid = [];
  for (let prop in strategies) {
    let strat = strategies[prop];
    if (semver.satisfies(version, strat.range) === true) {
      valid.push(strat);
    }
  }

  // -- parse our the leftmost satisfying segment from a range for the supplied version
  let getLeftmostVersion = (range) => {
    let logicals = range.split("||");
    let leftmost = null;
    logicals.forEach(p => {
      p = p.trim();
      if (semver.satisfies(version, p)) { // -- this is the logical that actually matches the version
        let rangeLR = p.split(" ");
        if (rangeLR.length > 0) {
          leftmost = semver.valid(rangeLR[0].trim().replace(/[<>]=?|=/, ""));
        }
      }
    });

    return leftmost;
  };

  // -- Get the strategy for the newest satisfying version for the passed version
  let strategy = valid.reduce((prev, curr) => {
    let prevLeft = getLeftmostVersion(prev.range);
    let currLeft = getLeftmostVersion(curr.range);
    return ((semver.compare(prevLeft, currLeft) === 1) ? prev : curr);
  }, { range: ">=0.0.0", factory: () => { } });

  return strategy.factory();
};
