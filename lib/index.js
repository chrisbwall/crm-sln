const semver = require("semver");
const strategies = require("./strategy-registry");
strategies.registerAll(`${__dirname}/strategy/**/dynamics-crm-*.js`);

/**
 * Create a zip archive object from an object representative of Solution data.
 *
 * @public
 * @param {Object} solution data used to build the zip archive.
 * @returns {Object} Returns a ProgressPromise which resolves a Zip archive object.
 */
module.exports.assemble = (uniqueName, targetCrmVersion) => {
  if (typeof uniqueName !== "string" || uniqueName == null || uniqueName === "") {
    throw new Error("[module]#assemble: argument 'init' must be a non-null Object.");
  }

  throw new Error("Not Implemented");

  var solution = Object.assign({}, init);

  return {
    include: {
      entity: (def) => {},
      securityRole: (role) => {},
      plugin: (plugin) => {}
    },
    with: {
      webResource: () => {

      },
      report: () => {

      },
      pluginAssembly: () => {

      },
      workflow: () => {

      }
    },
    close: () => {
      return module.exports.assembleFrom(solution);
    }
  }

};

/**
 * Create a SolutionFiles instance based on the provided data.
 *
 * @public
 * @param {Object} solution data used to build the files that constitute a Dynamics CRM Solution.
 * @returns {Object} Returns a ProgressPromise which resolves a SolutionFiles instance.
 */
module.exports.assembleFrom = (solution) => {
  if (typeof solution !== "object" || solution == null) {
    throw new Error("[module]#assembleFrom: argument 'solution' must be a non-null Object.");
  }

  if (solution.hasOwnProperty("targetVersion") === false || solution.targetVersion == null || semver.valid(solution.targetVersion) == null) {
    throw new Error("[module]#assembleFrom: argument 'solution' does not contain the required property 'targetVersion' or value does not conform to semantic version specification.");
  }

  let strategy = strategies.getFor(solution.targetVersion);
  if (typeof strategy !== "object" || strategy == null) {
    throw new Error("Could not resolve strategy for the target CRM version.");
  }

  return strategy.make(Object.freeze(solution));
};


/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @public
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
module.exports.disassemble = (files) => {
  if (typeof files !== "object" || files == null) {
    throw new Error("[module]#disassemble: argument 'files' must be a non-null Object.");
  }

  throw new Error("Not implemented");
};