/**
 * run allows us to run any hardhat task
 * here ethers is the hardhat ethers binding from the nomic labs scoped package
 * */
const { ethers, run, network } = require('hardhat')

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
  console.log('Deploying Contract ...')
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()
  console.log(`Deployed contract to ${simpleStorage.address}`)
}

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
