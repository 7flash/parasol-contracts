const advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: Date.now()
    }, (err, res) => {
      if(err) return reject(err);

      return resolve(res);
    })
  })
}

const latestTime = () => {
  return web3.eth.getBlock('latest').then((block) => block.timestamp);
}

const increaseTime = (duration) => {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id
    }, err => {
      if(err) return reject(err);

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id+1
      }, (err, res) => {
        if(err) return reject(err);

        resolve(res);
      })
    })
  })
}

const setTime = async (target) => {
  const latestTimeInSeconds = await latestTime()
  let diff = target - latestTimeInSeconds;
  if(diff <= 0) throw new Error("invalid target time");

  return increaseTime(diff);
}

module.exports = { advanceBlock, increaseTime, latestTime, setTime }
