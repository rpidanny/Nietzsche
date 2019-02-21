const { success, failure } = require('./utils/responses')

module.exports.test = (event, context, callback) => {
  return callback(null, success({ data: 'OK' }))
}

module.exports.mine = (event, context, callback) => {
  const { mineQuotes } = require('./miner')
  mineQuotes()
    .then(() => callback(null, success({ data: 'OK' })))
    .catch(err => callback(null, failure({ err })))
}

module.exports.tweet = (event, context, callback) => {
  const { tweet } = require('./twitter')
  tweet()
    .then(data => callback(null, success({ data })))
    .catch(err => callback(null, failure({ err })))
}

module.exports.tweetImage = (event, context, callback) => {
  const { tweetImage } = require('./twitter')
  tweetImage()
    .then(data => callback(null, success({ data })))
    .catch(err => callback(null, failure({ err })))
}
