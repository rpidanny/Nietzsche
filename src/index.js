const AWS = require('aws-sdk')
const { baseUrl, startPage, maxPage, routes } = require('./config/goodreads')

const sns = new AWS.SNS()

const getPageUrl = (route, page) => `${baseUrl}${route}?format=json&page=${page}`

module.exports.invokeScrappers = (event, context, callback) => {
  const { SNS_ARN } = process.env
  const pages = []
  // const maxPage = 1
  routes.forEach((route, idx) => {
    for (let i = startPage; i <= maxPage; i++) {
      pages.push(getPageUrl(route, i))
    }
  })

  Promise
    .all(pages.map(pageUrl => new Promise((resolve, reject) => {
      const params = {
        Message: 'Scrap',
        Subject: pageUrl,
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
