"use strict";

const expect = require("chai").expect;
const crmsln = require("../lib/index");

describe("CRM-SLN", () => {

  describe("#assembleFrom()", () => {

    var solution = null;
    before("create solution data for assembleFrom()", () => {

    });

    it("should return valid Solution Files object", () => {
      let sol = crmsln.assembleFrom(solution);
    });

    it("should throw error if argument is null", () => {
      expect(() => crmsln.assembleFrom(null)).to.throw();
    });
  });

  describe("#assemble()", () => {

  });

  describe("#disassemble()", () => {

    var files = null;
    before("create files data for disassemble()", () => {

    });

    it("should throw error is argument is null", () => {
      expect(() => crmsln.disassemble(null)).to.throw();
    });

    it("should return valid Solution object", () => {
      let o = crmsln.disassemble(files);
      expect(o).to.be.ok;
      expect(o).to.be.an("object");
    });

  });  
});