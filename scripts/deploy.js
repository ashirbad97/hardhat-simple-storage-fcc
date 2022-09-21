/**
 * run allows us to run any hardhat task
 * here ethers is the hardhat ethers binding from the nomic labs scoped package
 * */
const { ethers, run, network } = require('hardhat') //equivalent to hre (hardhat runtime environment)

async function main() {
  // deploying our contract
  const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
  console.log('Deploying Contract ...')
  const simpleStorage = await SimpleStorageFactory.deploy() //deploy's the contract
  await simpleStorage.deployed() // wait's till the contract has been deployed that is it has been mined in a block, this wait is explicitly for deployment
  console.log(`Deployed contract to ${simpleStorage.address}`)

  // calling verfiy function to invoke etherscan to verify our smartcontracts
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log(`Waiting for block confirmations......`)
    await simpleStorage.deployTransaction.wait(6) //waits for 6 blocks confirmation, deployTransaction only present in contract factory
    await verify(simpleStorage.address, [])
  }

  // interacting with the smart contracts by calling their functions, not a state change, fetches from the connected node
  const currentValue = await simpleStorage.retrieve()
  console.log(`Current value is ${currentValue}`)
  // update the current value, changes the state, so have to wait for confirmation
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Value is ${updatedValue}`)
}

// function to verfiy on etherscan
async function verify(contractAddress, args) {
  try {
    console.log('Verifying Contract ...')
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified')
    } else {
      console.log(error)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
