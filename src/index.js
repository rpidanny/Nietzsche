const { getQuotes } = require('./miner')
const { success, failure } = require('./utils/responses')

module.exports.test = (event, context, callback) => {
  return callback(null, success({ data: 'OK' }))
}

module.exports.mine = (event, context, callback) => {
  getQuotes()
    .then(quotes => callback(null, success(quotes)))
    .catch(err => callback(null, failure(err)))
}
