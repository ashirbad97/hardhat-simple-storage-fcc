const { expect, assert } = require('chai')
const { ethers } = require('hardhat')

//describe is a mocha thing also recognized by hardhat
describe('SimpleStorage', () => {
  let SimpleStorageFactory, simpleStorage //inside the scope of the describe
  beforeEach(async () => {
    // runs before all the it's
    // deploying th econtract before running tests
    SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
    simpleStorage = await SimpleStorageFactory.deploy()
  })
  // runs the test
  it('Should start with a favourite number of 0', async () => {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = '0'
    assert.equal(currentValue.toString(), expectedValue) //explicitly converting to string since Solidity uint256 returns a BigNumber
  })
  it('Should update when we call store', async () => {
    const expectedValue = '7'
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })
  it('Should add a person with a favourite number', async () => {
    const expectedValue = '9'
    const expectedName = 'Ashirbad'
    const transactionResponse = await simpleStorage.addPerson(
      expectedName,
      expectedValue
    )
    await transactionResponse.wait(1)
    // For referencing the solidity array use the () since this is a getter function instead of [] which can only be used inside solidity
    const { favouriteNumber, name } = await simpleStorage.people(0)
    const checkMapping = await simpleStorage.nameToFavoriteNumber('Ashirbad')
    assert.equal(checkMapping.toString(), expectedValue)
    assert.equal(favouriteNumber, expectedValue)
    assert.equal(name, expectedName)
  })
})
