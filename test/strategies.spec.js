"use strict";

const expect = require("chai").expect;
const Common = require("../lib/strategy");
const Crm2011 = require("../lib/strategy/dynamics-crm-2011");

// -- expect the end result to be similar enough to validate the output object
const validateMake = output => {
  throw new Error("Invalid make output");
};

const validateUnmake = output => {
  throw new Error("Invalid unmake output");
};

describe("Strategies", () => {

  describe("Common", () => {

    describe("#writeXml()", () => {
      const test = {
        version: "1.0.0",
        children: {
          child: ["Hello", "World"]
        },
        boo: {
          lean: "true",
          "": "false"
        },
        object: [{ id: 1, "": "Hello" }, { id: 2, "": "World" }]
      };

      it("Should write proper XML without declaration", () => {
        let xml = Common.writeXml(test, 'Test');
        let expectation = '<Test version="1.0.0"><children><child>Hello</child><child>World</child></children><boo lean="true">false</boo><object id="1">Hello</object><object id="2">World</object></Test>'
        expect(xml).to.equal(expectation);
    });

      it("Should write proper XML with declaration", () => {
        let xml = Common.writeXml(test, 'Test', true);
        let expectation = '<?xml version="1.0" encoding="utf-8"?><Test version="1.0.0"><children><child>Hello</child><child>World</child></children><boo lean="true">false</boo><object id="1">Hello</object><object id="2">World</object></Test>'
        expect(xml).to.equal(expectation);
      });
    });
  });

  // -- CRM 2011 Strategy Tests
  describe("CRM 2011", () => {

    let Strategy = null;
    before("Fake registration to acquire internal strategy", () => {
      Crm2011((range, strategy) => {
        Strategy = strategy;
      });
    });
    
    describe("#normalize()", () => {

      it("should throw error if supplied null argument", () => {
        //expect(Solution.normalize).withArgs(null).to.throwException();
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