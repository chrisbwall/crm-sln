"use strict";

const expect = require("chai").expect;
const ProgressPromise = require("../lib/progress-promise");

describe("ProgressPromise", () => {
  describe("#progress()", () => {

    it("should throw error if handler is not a function", (done) => {
      let p = new ProgressPromise((resolve, reject, report) => {
        setTimeout(() => {
          // -- noop
        }, 1000);
      });

      try {
        p.progress(null);
        done(new Error("Should have thrown error in progress()"));
      }
      catch(e) { done(); }

      p.then(() => {
        done(new Error("Should have thrown error in progress()"));
      }, done);
    });

    it("should allow action to report progress to the handler", (done) => {
      let callcount = 0;
      let p = new ProgressPromise((resolve, reject, report) => {
        setTimeout(() => {
          report(100, "Done");
          resolve();
        }, 500);
      });
      p.progress((pct, msg) => {
        callcount += 1;
        try {
          expect(pct).to.equal(100);
          expect(msg).to.equal("Done");
        }
        catch(e) { done(e); }
      }, done);
      p.then(() => {
        try {
          expect(callcount).to.equal(1);
          done();
        } 
        catch (e) {
          done(e);
        }
      }, done);
      p.catch(e => {
        done(e)
      }, done);
    });

    it("should allow action to report progress multiple times", (done) => {
      let currentPct = 0;
      let callCount = 0;
      let p = new ProgressPromise((resolve, reject, report) => {
        report(1, "Starting");
        setTimeout(() => {
          report(100, "Done");
          resolve();
        }, 500);
        report(50, "Waiting");
      });
      p.progress((pct, msg) => {
        callCount += 1;
        try {
          expect(pct).to.be.above(currentPct);
          if (pct === 1) {
            expect(currentPct).to.equal(0);
            expect(msg).to.equal("Starting");
          }
          else if (pct === 50) {
            expect(currentPct).to.equal(1);
            expect(msg).to.equal("Waiting");
          }
          else if (pct === 100) {
            expect(currentPct).to.equal(50);
            expect(msg).to.equal("Done");
          }
          else {
            throw new Error("Was not one of the expected progress reports.");
          }
        }
        catch(e) {
          done(e);
        }
        currentPct = pct;
      }, done);
      p.then(() => {
        try {
          expect(callCount).to.equal(3);
          done();
        }
        catch(e) {
          done(e);
        }
      }, done);
      p.catch(e => {
        done(e);
      }, done);
    });

  });
});
