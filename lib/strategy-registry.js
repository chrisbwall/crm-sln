"use strict";

const semver = require("semver");
const glob = require("glob");

var strategies = {};  // -- could be Map but why other than pedantic finger pointing?

/**
 * Registers a strategy to handle the specified version range. 
 * 
 * @param {String} string representing valid SEMVER range
 * @param {Object} object with make and unmake functions for processing internals
 * @returns {Object} returns ProgressPromise object which resolves to a SolutionFiles instance
 */
module.exports.register = function (range, strategy) {
  range = semver.validRange(range);

  if (range == null) {
    throw new Error("strategy-registry#register(): argument 'range' is not a valid Semver range string.");
  }

  if (strategies.hasOwnProperty(range) === true) {
    if (strategies[range] === strategy) {
      return;
    }

    throw new Error("strategy-registry#register(): argument 'range' is already registered by another strategy.");
  }

  if (typeof strategy !== "object" || strategy == null || strategy.hasOwnProperty("unmake") === false || strategy.hasOwnProperty("make") === false) {
    throw new Error("strategy-registry#register: argument 'strategy' must be a non-null object and contain implementations of functions named 'make' and 'unmake'.");
  }

  Object.defineProperty(strategies, range, {
    value: Object.freeze({ range, strategy }),
    writable: false,
    configurable: false,
    enumerable: true
  });
};

/**
 * Takes a GLOB pattern and loads all strategies found in the files which satisfy the pattern.
 * 
 * @param {String} glob pattern
 */
module.exports.registerAll = function (strategyGlob) {
  if (typeof strategyGlob !== "string" || strategyGlob === "") {
    throw new Error("strategy-registry#registerAll(): argument 'strategyGlob' must be a valid GLOB pattern string.");
  }

  let files = glob.sync(strategyGlob);
  if (Array.isArray(files) === true) {
    files.forEach(f => require(f)(module.exports.register)); // -- if glob is wrong, this will blow up!
  }  
};

/**
 * Determines if a strategy is registered for the given range. 
 * 
 * @param {String} SEMVER range string
 * @returns {Boolean} true if the range is registered, otherwise false
 */
module.exports.isRegistered = (range) => {
  return (semver.validRange(range) != null && strategies.hasOwnProperty(semver.validRange(range)));
};

/**
 * Get the best strategy to satisfy the provided version. 
 * 
 * @param {String} valid SEMVER version string
 * @returns {Object} strategy object for the supplied version, otherwise null
 */
module.exports.getFor = function (version) {
  version = semver.valid(version);

  if (version == null) {
    throw new Error("strategy-registry#getFor(): argument 'version' is not a valid Semver version string.");
  }

  // -- parse our the leftmost satisfying segment from a range for the supplied version
  const getLeftmostVersion = range => {
    range = semver.validRange(range);
    let logicals = range.split("||");
    let leftmost = "0.0.0";
    logicals.forEach(p => {
      p = p.trim();
      if (semver.satisfies(version, p)) { // -- this logical actually matches the version
        let rangeLR = p.split(" ");
        if (rangeLR.length > 0) {
          let testLeftmost = semver.valid(rangeLR[0].trim().replace(/[<>]=?|=/, ""));
          if (semver.gt(testLeftmost, leftmost) === true) {
            leftmost = testLeftmost; // -- get the highest leftmost from the logicals
          }
        }
      }
    });

    return leftmost;
  };

  // -- get an array of strategies where the range satisfies the provided version  
  let valid = [];
  for (let prop in strategies) {
    if (semver.satisfies(version, strategies[prop].range) === true) {
      valid.push(strategies[prop]);
    }
  }

  // -- I expect some amount of overlap since we are shooting for OCP compliance  
  // -- Get the strategy where the bottom of the range is closest to the provided version
  let strategy = valid.reduce((prev, curr) => {
    let prevLeft = getLeftmostVersion(prev.range);
    let currLeft = getLeftmostVersion(curr.range);
    return ((semver.gt(currLeft, prevLeft) === true) ? curr : prev);
  }, { range: ">=0.0.0", strategy: undefined });

  return strategy.strategy;
};

/**
 * Clears all registered strategies.
 */
module.exports.clear = () => {
  strategies = {};
};