const {ethers, upgrades, getChainId} = require("hardhat")

const {writeConfig,readConfig } = require('./utils/helper')
async function main() {

  let chainID = await getChainId();
  console.log("chainID==", chainID)

  let accounts = await ethers.getSigners()
  let deployer = accounts[0];
  const fee = ethers.utils.parseEther("0.001");
  const crossInscribeFactory = await ethers.getContractFactory("CrossInscribe", deployer);
  const crossInscribeProxy = await upgrades.deployProxy(crossInscribeFactory,
      [
        fee
      ],
      {
        initializer:  "init",
        unsafeAllowLinkedLibraries: true,
      });

  await writeConfig(chainID,chainID,"CROSS_CHAIN_CONTRACT",crossInscribeProxy.address);
  console.log("deployed" , crossInscribeProxy.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
