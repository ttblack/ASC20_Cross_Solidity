const {
    readConfig, sleep
} = require('./utils/helper')

const { ethers: hEether,upgrades } = require('hardhat');


const main = async () => {
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();
    let owner = accounts[0];

    let contractAddress = await readConfig(chainId, "CROSS_CHAIN_CONTRACT");
    console.log("contractAddress :", contractAddress);

    const contract_new = await ethers.getContractFactory("CrossInscribe", owner);
    await upgrades.upgradeProxy(
        contractAddress,
        contract_new,
    );
    await sleep(20000);
    console.log('contract upgraded ! ');

    const instanceV2 = await contract_new.attach(contractAddress);
   let version = await instanceV2.version();
    console.log("instanceV2", instanceV2.address, "version", version);
}

main();
