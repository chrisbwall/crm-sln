"use strict";

const expect = require("expect.js");
const Crm2011 = require("../lib/solution/strategy/dynamics-crm-2011");
const Crm2013 = require("../lib/solution/strategy/dynamics-crm-2013");
const Crm2013sp1 = require("../lib/solution/strategy/dynamics-crm-2013-sp1");
const Crm2015 = require("../lib/solution/strategy/dynamics-crm-2015");
const Crm2016 = require("../lib/solution/strategy/dynamics-crm-2016");

describe("Strategies", () => {

  // -- CRM 2011 Strategy Tests
  describe("CRM 2011", () => {

    let Solution = null;
    before("Fake registration to acquire internal strategy", () => {
      Crm2011((version, factory) => {
        Solution = factory();
      });
    });
    
    describe("#normalize()", () => {

      it("should throw error if supplied null argument", () => {
        expect(Solution.normalize).withArgs(null).to.throwException();
      });

      it("should throw error if supplied argument is missing required data", () => {

      });

      it("should provide standardized object with default values", () => {

      });

    });  

    describe("#generateSolutionFiles()", () => {

    });
  });

});