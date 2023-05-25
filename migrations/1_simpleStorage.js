var SimpleStorage = artifacts.require("./LogiChain.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};