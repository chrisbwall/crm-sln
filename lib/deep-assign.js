"use strict";

function mergeObjects(a, b) {
  let x = Object.assign({}, a);
  Object.keys(b).forEach(p => {
    if (typeof b[p] === "object" && Array.isArray(b[p]) === false && b[p] != b && b[p] != null) {
      x[p] = mergeObjects(x[p], b[p]);
    }
    else {
      x[p] = b[p];
    }
  });

  return x;
};

function process() {
  const objs = Array.from(arguments).filter(o => o !== null && o !== undefined);

  if (objs.filter(o => typeof o !== "object" || Array.isArray(o)).length > 0) {
    throw new Error("deep-assign#(): supplied arguments include primitives which cannot be merged using deep-assign");
  }

  if (objs.length === 0) {
    return null;
  }

  if (objs.length === 1) {
    return objs[0];
  }

  return objs.reduce((aggregate, next) => {
    if (next === null || typeof next !== "object" || Array.isArray(next) === true) {
      return aggregate;
    }

    return mergeObjects(Object.freeze(aggregate), Object.freeze(next));
  }, {});
};

module.exports = process;