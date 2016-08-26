"use strict";

// -- global requires
const semver = require("semver");
const redux = require("redux");
const immutable = require("immutable");

// -- inital state
const store = Object.freeze({
  solution: immutable.Map({
    "SolutionManifest": immutable.Map({})
  }),
  customizations: immutable.Map({}),
  content_types: immutable.Map({}),
  webResources: immutable.List(),
  reports: immutable.List(),
  workflows: immutable.List(),
  pluginAssemblies: immutable.List()
});

// -- reducer functions
const solution = (state, action) => { };
const customizations = (state, action) => { };
const content_types = (state, action) => { };
const webResources = (state, action) => { };
const reports = (state, action) => { };
const workflows = (state, action) => { };
const pluginAssemblies = (state, action) => { };

// -- root reducer
const rootReducer = redux.combineReducers({
  solution, customizations, content_types, webResources, reports, workflows, pluginAssemblies
});

// -- assemble helper object
const builder = {
  setProperty: (property, value) => { 
    return builder;
  },
  with: {
    entity: (data) => {
      return {
        setProperty: (property, value) => { },
        setAttribute: (attribute) => { },
        setForm: (systemForm) => { }
      }
    }
  }
};

/**
 * Create a zip archive object from an object representative of Solution data.
 *
 * @public
 * @param {Object} solution data used to build the zip archive.
 * @returns {Object} Returns a ProgressPromise which resolves a Zip archive object.
 */
module.exports.assemble = (uniqueName, targetCrmVersion, init, strict) => {
  if (typeof uniqueName !== "string" || uniqueName == null || uniqueName === "") {
    throw new Error("[module]#assemble: argument 'init' must be a non-null Object.");
  }

  throw new Error("Not Implemented");

  
/*
  var solution = Object.assign({}, init);

  return {
    component: {
      entity: (def) => {},
      securityRole: (role) => {},
      plugin: (plugin) => {}
    },
    file: {
      webResource: (uniqueName, buffer) => {

      },
      report: (uniqueName, buffer) => {

      },
      pluginAssembly: (uniqueName, buffer) => {

      },
      workflow: (uniqueName, buffer) => {

      }
    },
    close: () => {
      return solution;
    }
  }
*/
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
    throw new Error("[module]#assembleFrom(): argument 'solution' must be a non-null Object.");
  }

  if (solution.hasOwnProperty("targetVersion") === false || solution.targetVersion == null || semver.valid(solution.targetVersion) == null) {
    throw new Error("[module]#assembleFrom(): argument 'solution' does not contain the required property 'targetVersion' or value does not conform to semantic version specification.");
  }

  let strategy = strategies.getFor(solution.targetVersion);
  if (typeof strategy !== "object" || strategy == null) {
    throw new Error("[module]#assembleFrom(): Could not resolve strategy for the target CRM version.");
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