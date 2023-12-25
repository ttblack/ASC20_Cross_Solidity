const {ethers, getChainId} = require("hardhat")
const hardhat = require('hardhat');
const Web3 = require("web3")
const {readConfig, sleep} = require('./utils/helper')
async function main() {
    const rpcUrl = hardhat.network.config.url;
    let web3 = new  Web3(rpcUrl)
    let chainID = await getChainId();
    console.log("chainID==", chainID)

    let accounts = await ethers.getSigners()
    let account = accounts[0]
    console.log("account", account.address)
    let contractAddress = await readConfig(chainID,"CROSS_CHAIN_CONTRACT");
    const contractFactory = await ethers.getContractFactory('CrossInscribe',account)
    let contract  = await contractFactory.connect(account).attach(contractAddress);

    let balance = await web3.eth.getBalance(contract.address)
    console.log("balance 1", web3.utils.fromWei(balance))
    const fee = ethers.utils.parseEther("0.001");
    let tx = await contract.crossToBTC("2N9BmGSMvd7srA5vUaf5htbwuQoWh79sKUg", "ela", 10,{value:fee});
    console.log("tx",tx.hash)
    await sleep(10000)
    balance = await web3.eth.getBalance(contract.address)
    console.log("balance 2",web3.utils.fromWei(balance))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
