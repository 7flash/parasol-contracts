const fs = require("fs")

function getContext() {
  const context = JSON.parse(fs.readFileSync('./context.json'))
  return context
}

module.exports = {
    dev: { // Ganache-cli options (https://github.com/trufflesuite/ganache-cli)
        port:8555,
        total_accounts:10,
        locked:false,
        debug:false,
        //logger:console,
        gasPrice: 0
    },
    contracts : "*", // To select specific contract locations, replace it with an array: ["File1.sol", "Folder/File2.sol"]
    solc: { // Solidity compiler options (https://solidity.readthedocs.io/en/develop/using-the-compiler.html)
        optimizer: {
          enabled: true,
          // Optimize for how many times you intend to run the code.
          // Lower values will optimize more for initial deployment cost, higher values will optimize more for high-frequency usage.
          runs: 200
        },
        evmVersion: "byzantium", // Version of the EVM to compile for. Affects type checking and code generation. Can be homestead, tangerineWhistle, spuriousDragon, byzantium or constantinople
        // UNCOMMENT IF USING LIBRARIES: Addresses of the libraries. If not all libraries are given here, it can result in unlinked objects whose output data is different.
        // libraries: {
        //   // The top level key is the the name of the source file where the library is used.
        //   // If remappings are used, this source file should match the global path after remappings were applied.
        //   // If this key is an empty string, that refers to a global level.
        //   "myFile.sol": {
        //     "MyLib": "0x123123..."
        //   }
        // },
        outputSelection: {
          "*": {
            "*": [ "metadata", "evm.bytecode", "devdoc" ]
          }
        }
    },
    preprocessor: {
        context: getContext(),
        settings: { // Underscore.js.template settings. Read more: https://underscorejs.org/#template
          evaluate:    /{{([\s\S]+?)}}/g,
          interpolate: /{{=([\s\S]+?)}}/g,
          escape:      /{{-([\s\S]+?)}}/g
        },
        strict: false // If true, strict mode will abort deployment on warnings as well as errors
    },
    deployer: async function (contracts, network, web3, test, save) {
      const from = web3.eth.accounts.wallet[0].address
      const gasPrice = 20*10**18
      const gas = 4*10**6

      console.log(`Your wallet: ${from}`)

      contracts['Token.psol:Token'] = await contracts['Token.psol:Token'].deploy().send({ from, gasPrice, gas })

      const tokenAddress = contracts['Token.psol:Token'].options.address

      console.log((`Token deployed at address ${tokenAddress}`).green)

      contracts['Tokensale.psol:Tokensale'] = await contracts['Tokensale.psol:Tokensale'].deploy({
        arguments: [tokenAddress]
      }).send({ from, gasPrice, gas })

      const tokensaleAddress = contracts['Tokensale.psol:Tokensale'].options.address

      console.log((`Tokensale deployed at address ${tokensaleAddress}`).green)

      await contracts['Token.psol:Token'].methods.pause().send({ from })

      console.log((`Token is set to pause by ${from}`).green)

      await contracts['Token.psol:Token'].methods.addMinter(tokensaleAddress).send({ from })

      console.log((`${tokensaleAddress} is allowed to mint ${tokenAddress} by ${from}`).green)

      save(contracts)

      test(contracts)
    }
}
