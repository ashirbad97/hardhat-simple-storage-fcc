const { task } = require('hardhat/config')

task('block-number', 'Prints the current block number').setAction(
  async (taskArgs, hre) => {
    //hre is similar to the require("hardhat")
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`Current block number: ${blockNumber}`)
  }
)

module.exports = {}
