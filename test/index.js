"use strict";

const expect = require("expect.js");
const crmsln = require("../lib/index");

describe("CRM-SLN", () => {

  var solution = null;
  before("create solution data for assembleFrom()", () => {

  });

  describe("#assembleFrom()", () => {
    it("should return valid JSZip object", () => {
      let zip = crmsln.assembleFrom(solution);
    });

    it("should throw error if argument is null", () => {
      expect(crmsln.assembleFrom).withArgs(null).to.throwException();
    });
  });

  describe("#assemble()", () => {

  });

  describe("#disassemble()", () => {

    it("should throw error is argument is null", () => {
      expect(crmsln.disassemble).withArgs(null).to.throwException();
    });

    it("should return valid Solution object", () => {
      let o = crmsln.disassmble();
      expect(o).to.be.ok();
      expect(o).to.be.an("object");
    });

  });  
});