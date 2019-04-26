const dynamoDb = require('./utils/dynamodb')
const { success, failure } = require('./utils/responses')

module.exports.handler = (event, context, callback) => {
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
      callback(null, failure(JSON.stringify(err)))
    } else {
      console.log(result)
      success(JSON.stringify({
        data: result
      }))
    }
  })
}
