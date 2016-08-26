
// -- all module loads and other logic should be within this function
// -- to help to not load too much when strategies are invited to join
// -- the strategy registry
function applyStrategy() {

};

const versionRange = "~5";

module.exports.inviteToRegister = function (register) {
  register(versionRange, applyStrategy);
};