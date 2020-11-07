const AWS = require('aws-sdk')
const { routes } = require('./config/goodreads')

const sns = new AWS.SNS()

module.exports.handler = (event, context, callback) => {
  const { SNS_ARN } = process.env

  Promise
    .all(routes.map(route => new Promise((resolve, reject) => {
      const params = {
        Message: 'Scrap',
        Subject: route,
        TopicArn: SNS_ARN
      }
      sns.publish(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })))
    .then(event.done)
    .catch(callback)
}
