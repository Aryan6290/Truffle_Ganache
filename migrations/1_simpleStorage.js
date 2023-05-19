var SimpleStorage = artifacts.require("./MusiChain.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};