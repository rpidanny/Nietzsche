const dynamoDb = require('./utils/dynamodb')
const { success, failure } = require('./utils/responses')

const getRandomQuote = () => new Promise((resolve, reject) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: '#notified = :flag AND #likes > :likes',
    ExpressionAttributeNames: {
      '#notified': 'notified',
      '#likes': 'likes'
    },
    ExpressionAttributeValues: {
      ':flag': false,
      ':likes': 5000
    },
    Limit: 10000
  }
  dynamoDb.scan(params, (err, result) => {
    if (err) {
      reject(err)
    } else {
      const { Items, Count } = result
      const index = Math.floor(Math.random() * Count)
      const quote = Items[index]
      console.log(result)
      resolve(quote)
    }
  })
})

const getRandomQuoteQuery = () => new Promise((resolve, reject) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'likes-index',
    KeyConditionExpression: '#likes > :likes',
    ExpressionAttributeNames: {
      // '#notified': 'notified',
      '#likes': 'likes'
    },
    ExpressionAttributeValues: {
      // ':flag': false,
      ':likes': 5000
    },
    Limit: 100
  }
  dynamoDb.query(params, (err, result) => {
    if (err) {
      reject(err)
    } else {
      const { Items, Count } = result
      const index = Math.floor(Math.random() * Count)
      const quote = Items[index]
      console.log(result)
      resolve(quote)
    }
  })
})

module.exports.handler = (event, context, callback) => {
  getRandomQuoteQuery()
    .then(quote => callback(null, success(JSON.stringify(quote, null, 2))))
    .catch(err => callback(err))
}
