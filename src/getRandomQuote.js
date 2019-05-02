const dynamoDb = require('./utils/dynamodb')

const { NoQuoteError } = require('./utils/customErrors')
const { likesThreshold, preferredAuthors } = require('./config/quotes')

const index = Math.floor(Math.random() * preferredAuthors.length)

module.exports.handler = (event, context, callback) => {
  const author = preferredAuthors[index]

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: '#author = :author',
    FilterExpression: '#likes >= :likes AND #used <= :used',
    ExpressionAttributeNames: {
      '#author': 'author',
      '#likes': 'likes',
      '#used': 'used'
    },
    ExpressionAttributeValues: {
      ':author': author,
      ':likes': likesThreshold,
      ':used': process.env.QUOTE_USED_THRESHOLD || 0
    },
    Limit: 20
  }
  dynamoDb.query(params, (err, result) => {
    const { Items, Count } = result
    if (err) {
      callback(err)
    } else {
      if (Count > 0) {
        const index = Math.floor(Math.random() * Count)
        const quote = Items[index]
        console.log(`Found ${result.Count} quotes from ${author}`)
        callback(null, quote)
      } else {
        callback(new NoQuoteError(`No quote from author: ${author}`))
      }
    }
  })
}
