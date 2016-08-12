"use strict";

const expect = require("expect.js");
const path = require("path");
const semver = require("semver");

describe("StrategyRegistry", () => {
  describe("#resolveAll", () => {
    let sr = require("../lib/strategy-registry");

    it("should throw error if glob is empty or not a string", () => {
      expect(sr.registerAll).withArgs("").to.throwException();
      expect(sr.registerAll).withArgs(true).to.throwException();
    });

    it("should register all strategies loaded from files when glob provided", () => {
      sr.registerAll(path.resolve(`${__dirname}/../lib/strategy/**/dynamics-crm-*.js`));
      expect(sr.isRegistered).withArgs("5.x").to.be.ok();
      expect(sr.isRegistered).withArgs("1.0.x").to.not.be.ok();
    });

  });

  describe("#register", () => {
    let sr = require("../lib/strategy-registry");
    let fn = () => {};

    it("should register a strategy for use", () => {
      sr.register("1.9.x", { make: fn, validate: fn, normalize: fn });
      expect(sr.isRegistered).withArgs("1.9.x").to.be.ok();
    });

    it("should throw error if version is invalid", () => {
      expect(sr.register).withArgs("foobar", { make: fn, validate: fn, normalize: fn }).to.throwException();
    });

    it("should throw error if strategy is not a non-null object", () => {
      expect(sr.register).withArgs("1.0", null).to.throwException();
      expect(sr.register).withArgs("1.0", "foobar").to.throwException();
    });

    it("should throw error if strategy does not have the correct shape",() => {
      expect(sr.register).withArgs("5.9", { make: fn }).to.throwException();
      expect(sr.register).withArgs("5.9", { validate: fn }).to.throwException();
      expect(sr.register).withArgs("5.9", { normalize: fn }).to.throwException();
      expect(sr.register).withArgs("5.9", { make: fn, validate: fn, normalize: fn }).to.be.ok();
    });

  });

  describe("#getFor", () => {
    let registry = require("../lib/strategy-registry");

    before("register individual strategies", () => {
      let fn = (v) => { 
        return () => { return v; };
      };
      
      registry.register("5.0.x", { make: fn("5.0.x"), validate: fn("5.0.x"), normalize: fn("5.0.x") });
      registry.register("5.1.x", { make: fn("5.1.x"), validate: fn("5.1.x"), normalize: fn("5.1.x") });
      registry.register("5.5", { make: fn("5.5"), validate: fn("5.5"), normalize: fn("5.5") });
      registry.register("~5.5.6", { make: fn("~5.5.6"), validate: fn("~5.5.6"), normalize: fn("~5.5.6") });
    });

    it("should return strategy based on semver", () => {
      let s = registry.getFor("5.0.9690");
      expect(s.v).to.be("5.0.x");
      expect(s.test).to.be(true);

      let s2 = registry.getFor("5.5.2");
      expect(s2.v).to.be("5.5.0");
      expect(s2.test).to.be(true);
    });

    it("should return undefined if no registered strategy satisfies the expected version", () => {
      let s = registry.getFor("1.0.2");
      expect(s).to.be(undefined);
    });

    it("should return the newest satisfying version", () => {
      let s = registry.getFor("5.5.8");
      expect(s.v).to.be("5.5.6");
    });

  });
});
