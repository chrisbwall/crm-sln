"use strict";

const writeElement = (name, data) => {
  if (typeof data === "string" && name === "") return data;

  let attrs = [name];
  let children = [];

  for (let p in data) {
    if (data[p] === undefined) {
      continue;
    }
    else if (Array.isArray(data[p])) {
      data[p].forEach(d => {
        let val = ((typeof d === "object") ? d : { "" : d });
        children.push({ name: p, value: val })
      });
    }
    else if (p === "") {
      if (data[p] === null) {
        attrs.push({ name: "xsi:nil", value: "true" });
      }
      else {
        children.push({ name: p, value: data[p] });
      }
    }
    else if (typeof data[p] === "object") {
      children.push({ name: p, value: data[p] || "" });
    }
    else {
      attrs.push(`${p}="${data[p]}"`);
    }
  }

  return `<${attrs.join(" ")}>${children.reduce((i, c) => i += writeElement(c.name, c.value), '')}</${name}>`;
};

module.exports.writeXml = (graph, rootElement, includeDeclaration) => {
  return `${((includeDeclaration === true) ? '<?xml version="1.0" encoding="utf-8"?>' : '')}${writeElement(rootElement, graph)}`;
};