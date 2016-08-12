const ProgressPromise = require("../progress-promise");
const common = require("./index");

const solutionDefaults = Object.freeze({
  ImportExportXml: {
    $version: null,
    $minimumversion: "5.0",
    $languagecode: "1033",
    $generatedBy: "OnPremise",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    SolutionManifest: {
      UniqueName: 
    }
  }
});

const validate = (solution) => {
  let errors = [];

  let slnrules = { 
    "uniqueName": common.rules.uniqueName, 
    "targetVersion": common.rules.targetVersion,
    "displayName": common.rules.displayName
  };

  for (let r in slnrules) {
    if (slnrules[r](solution[r]) === false) {
      errors.push(`Solution#${r} validation failed.`);
    }
  }

  return { isValid: (errors.length === 0), errors };
};

/**
 * Takes SolutionFilesMap instance and transform it into a normalized object
 *  which can be used to generate the solution XML files.
 * 
 * @param {Object} SolutionFilesMap object
 * @returns {Object} returns SolutionFiles object
 */
const make = (solution) => {
  return new ProgressPromise((resolve, reject, report) => {
    try {
      // -- validate
      report(1, "Validating solution data...");
      let validationResult = validate(solution);
      if (validationResult.isValid === false) {
        report(100, "Error encountered so exiting.");
        reject(new Error("Validation Errors: \n" + validationResult.errors.join("\n")));
      }

      let sln = Object.assign({}, defaults, solution);
      solution = Object.freeze(solution);

      report(1, "Determining build strategy for target CRM version...");


      report(10, "Validating the solution data...");
      let validation = strategy.validate(solution);
      if (validation.isValid === false) {
        report(100, "Error encountered so exiting.");
        reject(new Error(validation.errors.join("\n")));
      }

      report(33, "Normalizing data into file map...");
      let map = strategy.normalize(solution);
      if (typeof map !== "object" || map == null) {
        report(100, "Error encountered so exiting.");
        reject(new Error("Unable to normalize the solution data into a files map."));
      }

      report(66, "Generating solution files from map...");
      let files = strategy.make(map);
      if (typeof files !== "object" || files == null) {
        report(100, "Error encountered so exiting.");
        reject(new Error("Unable to generate the Solution files from the derived map."));
      }

      report(100, "Finished making solution files...");
      resolve(Object.freeze(files));
    }
    catch (e) {
      report(100, "Error encountered so exiting.");
      reject(e);
    }
  });
};

const unmake = (files) => {

};

/**
 * Registers a factory method for the Dynamics CRM 2011 strategy.
 * 
 * @param {Function} Callback used to register the factory
 */
module.exports = function (register) {
  register("5.x", { make, unmake });
};