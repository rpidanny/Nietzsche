const dynamoDb = require('./utils/dynamodb')
const { success, failure } = require('./utils/responses')

module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2))
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: '#author = :author',
    ExpressionAttributeNames: {
      '#author': 'author'
    },
    ExpressionAttributeValues: {
      ':author': 'Albert Einstein'
    }
    // Limit: 100
  }
  dynamoDb.query(params, (err, result) => {
    if (err) {
      callback(null, failure(err))
    } else {
      console.log(result)
      callback(null, success(result))
    }
  })
}
