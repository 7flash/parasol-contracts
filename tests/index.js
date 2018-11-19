const context = require('../context.json')

const token = contracts['Token.psol:Token']
const tokensale = contracts['Tokensale.psol:Tokensale']

const { advanceBlock, setTime } = require('./utils.js')

describe('Token info', function() {
  it('should have correct name', async () => {
    assert.equal(await token.methods.name().call(), context.tokenName)
  })

  it('should have correct symbol', async () => {
    assert.equal(await token.methods.symbol().call(), context.tokenSymbol)
  })

  it('should have correct decimals', async () => {
    assert.equal(await token.methods.decimals().call(), context.tokenDecimals)
  })

  it('should be paused', async () => {
    assert.equal(await token.methods.paused().call(), true)
  })

  it('should allow tokensale to mint', async () => {
    assert.equal(await token.methods.isMinter(tokensale.options.address).call(), true)
  })
})

describe('Tokensale info', function() {
  it('should have correct openingTime', async () => {
    assert.equal(await tokensale.methods.openingTime().call(), context.openingTime)
  })

  it('should have correct closingTime', async () => {
    assert.equal(await tokensale.methods.closingTime().call(), context.closingTime)
  })

  it('should have correct rate', async () => {
    assert.equal(await tokensale.methods.rate().call(), context.rate)
  })

  it('should have correct cap', async () => {
    assert.equal(await tokensale.methods.cap().call(), context.cap)
  })

  it('should have correct wallet', async () => {
    assert.equal(await tokensale.methods.wallet().call(), context.wallet)
  })

  it('should have cap that is not reached', async function() {
    assert.equal(await tokensale.methods.capReached().call(), false)
  })
})
