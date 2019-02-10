const { mineQuotes } = require('./miner')
const { tweet } = require('./twitter')
const { success, failure } = require('./utils/responses')

module.exports.test = (event, context, callback) => {
  return callback(null, success({ data: 'OK' }))
}

module.exports.mine = async (event, context, callback) => {
  mineQuotes()
    .then(() => callback(null, success({ data: 'OK' })))
    .catch(err => callback(null, failure({ err })))
}

module.exports.tweet = (event, context, callback) => {
  tweet()
    .then(data => callback(null, success({ data })))
    .catch(err => callback(null, failure({ err })))
}
