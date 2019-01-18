const { getQuotes } = require('./miner')
const { success, failure } = require('./utils/responses')

const { maxPage } = require('./config')

module.exports.test = (event, context, callback) => {
  return callback(null, success({ data: 'OK' }))
}

module.exports.mine = async (event, context, callback) => {
  try {
    for (let page = 1; page < maxPage + 1; page++) {
      const quotes = await getQuotes(page)
      // save quotes to db
    }
    callback(null, success({ data: 'OK' }))
  } catch (err) {
    callback(null, failure(err))
  }
}
