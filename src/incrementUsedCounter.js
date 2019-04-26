const dynamoDb = require('./utils/dynamodb')

module.exports.handler = (event, context, callback) => {
  const quote = {
    likes: 2417,
    updatedAt: '1556205736471',
    createdAt: '1556205736471',
    text:
      'When the snows fall and the white winds blow, the lone wolf dies but the pack survives.',
    used: 0,
    quoteId: '214e857d1df74a32b7141f532514d16d',
    tags: ['friendship', 'loneliness'],
    author: 'George R.R. Martin'
  }

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
    }
  }
  dynamoDb.update(params, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(null, result)
    }
  })
}
