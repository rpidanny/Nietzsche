const AWS = require('aws-sdk')

const { success, failure } = require('./utils/responses')

module.exports.saveQuote = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2))
  event.Records.forEach(record => {
    // TODO: Save record to DB
  })
  callback(null, success(JSON.stringify({ data: 'OK' })))
}
