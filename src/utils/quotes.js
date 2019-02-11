const dynamoDb = require('./dynamodb')

const getRandomQuote = () => new Promise((resolve, reject) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: '#tweeted <> :flag',
    ExpressionAttributeNames: {
      '#tweeted': 'tweeted'
    },
    ExpressionAttributeValues: {
      ':flag': true
    },
    Limit: 100
  }
  dynamoDb.scan(params, (err, result) => {
    if (err) {
      reject(err)
    } else {
      const { Items, Count } = result
      const index = Math.floor(Math.random() * Count)
      const quote = Items[index]
      resolve(quote)
    }
  })
})

const markQuoteAsDone = id => new Promise((resolve, reject) => {
  const params2 = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id
    },
    ExpressionAttributeNames: {
      '#tweeted': 'tweeted'
    },
    ExpressionAttributeValues: {
      ':flag': true
    },
    UpdateExpression: 'SET #tweeted = :flag',
    ReturnValues: 'ALL_NEW'
  }
  dynamoDb.update(params2, (err, res) => {
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  })
})

module.exports = {
  getRandomQuote,
  markQuoteAsDone
}
