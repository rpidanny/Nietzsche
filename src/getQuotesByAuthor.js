const dynamoDb = require('./utils/dynamodb')
const { success, failure } = require('./utils/responses')

module.exports.handler = (event, context, callback) => {
  const author = decodeURI(event.pathParameters.author || '')
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: '#author = :author',
    ExpressionAttributeNames: {
      '#author': 'author'
    },
    ExpressionAttributeValues: {
      ':author': author
    }
    // Limit: 100
  }
  dynamoDb.query(params, (err, result) => {
    if (err) {
      callback(null, failure(err))
    } else {
      console.log(`Found ${result.Count} quotes from ${author}`)
      callback(null, success(result))
    }
  })
}
