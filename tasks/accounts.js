// Custom Hardhat tasks, similar to plugins

const { task } = require('hardhat/config')
task('accounts', 'Prints the list of accounts').setAction(
  async (taskArgs, hre) => {
    //hre gets injected into the global scope
    const accounts = await hre.ethers.getSigners()
    for (const account of accounts) {
      console.log(account.address)
    }
  }
)

module.exports = {}
