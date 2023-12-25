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

    const price = ethers.utils.parseEther("0.001");
    const amount = 10;
    let date = new Date('2024-01-01');
    let timestamp = date.getTime();
    console.log(timestamp);

    let tx = await contract.createOrder(price, amount,timestamp, "0xb112ef385f93cf58318580dbcc7a029a5def0139e8d5499a1078eda1526d34cb");
    console.log("tx",tx.hash);
    await sleep(8000);
    let order = await contract.getOrders();
    console.log("order",order);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
