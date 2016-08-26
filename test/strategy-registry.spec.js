"use strict";

const expect = require("chai").expect;
const path = require("path");
const semver = require("semver");
const sr = require("../lib/strategy-registry");

describe("StrategyRegistry", () => {

  afterEach("clear the registry after each test", () => sr.clear());

  describe("#registerAll", () => {

    it("should throw error if glob is empty or not a string", () => {
      expect(() => sr.registerAll("")).to.throw();
      expect(() => sr.registerAll(true)).to.throw();
    });

    it("should register all strategies loaded from files when glob provided", () => {
      sr.registerAll(path.resolve(`${__dirname}/../lib/strategy/**/dynamics-crm-*.js`));
      expect(sr.isRegistered("5.x")).to.be.true;
      expect(sr.isRegistered("1.0.x")).to.be.false;
    });

  });

  describe("#register", () => {

    const fn = () => {};

    it("should register a strategy for use", () => {
      sr.register("1.9.x", { make: fn, unmake: fn });
      expect(sr.isRegistered("1.9.x")).to.be.true;
    });

    it("should throw error if version is invalid", () => {
      expect(() => sr.register("foobar", { make: fn, unmake: fn })).to.throw();
    });

    it("should throw error if strategy is not a non-null object", () => {
      expect(() => sr.register("1.0", null)).to.throw();
      expect(() => sr.register("1.0", "foobar")).to.throw();
    });

    it("should throw error if strategy does not have the correct shape",() => {
      expect(() => sr.register("5.9", { make: fn })).to.throw();
      expect(() => sr.register("5.9", { foo: fn })).to.throw();
      expect(() => sr.register("5.9", { unmake: fn })).to.throw();
      expect(() => sr.register("5.9", { make: fn, unmake: fn })).to.not.throw();
    });

  });

  describe("#isRegistered", () => {

    it("should return true if strategy is registered", () => {
      sr.register("^6.0", { make: () => {}, unmake: () => {} });
      expect(sr.isRegistered("^6.0")).to.be.true;
    });

    it("should return false if strategy is not registered", () => {
      expect(sr.isRegistered("~1.0.5")).to.be.false;
    });

  });

  describe("#clear", () => {

    beforeEach("init the registry", () => {
      sr.register("5.9", { make: () => {}, unmake: () => {} });
      sr.register("^6.0", { make: () => {}, unmake: () => {} });
    });

    it("should clear out registered strategies", () => {
      expect(sr.isRegistered("5.9")).to.be.true;
      expect(sr.isRegistered("^6.0")).to.be.true;

      sr.clear();

      expect(sr.isRegistered("5.9")).to.be.false;
      expect(sr.isRegistered("^6.0")).to.be.false;      
    });
  });

  describe("#getFor", () => {

    beforeEach("register individual strategies", () => {
      let fn = (v) => { 
        return () => v;
      };
      
      sr.register("5.0.x", { make: fn("5.0.x"), unmake: fn("5.0.x") });
      sr.register("5.1.x", { make: fn("5.1.x"), unmake: fn("5.1.x") });
      sr.register("5.5", { make: fn("5.5"), unmake: fn("5.5") });
      sr.register("~5.5.6", { make: fn("~5.5.6"), unmake: fn("~5.5.6") });
    });

    it("should return strategy based on semver", () => {
      let s = sr.getFor("5.0.9690");
      expect(s).to.be.ok;
      expect(s.make()).to.equal("5.0.x");

      let s2 = sr.getFor("5.5.2");
      expect(s2).to.be.ok;
      expect(s2.make()).to.equal("5.5");
    });

    it("should return undefined if no registered strategy satisfies the expected version", () => {
      let s = sr.getFor("1.0.2");
      expect(s).to.be.undefined;
    });

    it("should return the newest satisfying version", () => {
      let s = sr.getFor("5.5.8");
      expect(s.make()).to.equal("~5.5.6");
    });

  });
});
