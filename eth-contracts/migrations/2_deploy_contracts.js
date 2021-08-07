// migrating the appropriate contracts
var Verifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var RealEstateToken = artifacts.require("./RealestokenERC721Token.sol");

module.exports = function(deployer) {
  deployer.deploy(Verifier);
  deployer.deploy(SolnSquareVerifier);
  deployer.deploy(RealEstateToken);
};
