"use strict";

const expect = require("chai").expect;
const deepAssign = require("../lib/deep-assign");

describe("#deep-assign()", () => {

  it("should return null if given no arguments", () => {
    expect(deepAssign()).to.be.null;
  });

  it("should return argument is others are null", () => {
    const a = { test: true };
    const c = deepAssign(a, null, undefined);
    expect(a).to.be.ok;
    expect(a.test).to.be.true;
  });

  it("should throw error if non-object is passed", () => {
    expect(() => deepAssign({}, 12)).to.throw();
    expect(() => deepAssign({}, ['z'])).to.throw();
    expect(() => deepAssign({}, [{},{}])).to.throw();
  });

  it("should perform deep copy", () => {

    const a = { 
      version: "1.0.0", 
      publisher: {
        address1: {
          line1: null,
          city: null,
          state: null,
          zip: null
        },
        address2: {
          line1: null,
          city: null,
          state: null,
          zip: null
        },
        email: null,
        website: null
      },
      isManaged: false
    };

    const b = {
      version: "1.0.1",
      publisher: {
        address1: {
          zip: "30028",
          country: "USA"
        },
        email: "test@test.com"
      },
      entities: [ { id: 'test_testing' } ]
    };

    const c = deepAssign(a, b);

    expect(c.version).to.equal("1.0.1");
    expect(c.publisher.address1.line1).to.be.null;
    expect(c.publisher.address1.city).to.be.null;
    expect(c.publisher.address1.state).to.be.null;
    expect(c.publisher.address1.zip).to.equal("30028");
    expect(c.publisher.address2.line1).to.be.null;
    expect(c.publisher.address2.city).to.be.null;
    expect(c.publisher.address2.state).to.be.null;
    expect(c.publisher.address2.zip).to.be.null;
    expect(c.publisher.website).to.be.null;
    expect(c.publisher.email).to.equal("test@test.com");
    expect(c.isManaged).to.be.false;
    expect(c.publisher.address1.country).to.equal("USA")
    expect(c.entities).to.deep.include.members([{ id: 'test_testing' }])
  });
});