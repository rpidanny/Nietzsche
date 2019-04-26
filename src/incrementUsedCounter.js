const dynamoDb = require('./utils/dynamodb')

module.exports.handler = (event, context, callback) => {
  const quote = event

  if (quote) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        'author': quote.author,
        'quoteId': quote.quoteId
      },
      UpdateExpression: 'set #used = :usedCount, #updatedAt = :updateDate',
      ExpressionAttributeNames: {
        '#used': 'used',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':usedCount': quote.used + 1,
        ':updateDate': Date.now().toString()
      },
      ReturnValues: 'UPDATED_NEW'
    }
    dynamoDb.update(params, (err, result) => {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  } else {
    callback(new Error('Invalid Data'))
  }
}
