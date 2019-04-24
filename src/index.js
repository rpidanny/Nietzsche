const AWS = require('aws-sdk')
const { startPage, maxPage, routes } = require('./config/goodreads')

const sns = new AWS.SNS()

const baseURL = 'https://www.goodreads.com'

const getPageUrl = (route, page) => `${baseURL}${route}?format=json&page=${page}`

module.exports.invokeScrappers = (event, context, callback) => {
  const { SNS_ARN } = process.env
  const pages = []

  routes.forEach((route, idx) => {
    for (let i = startPage; i <= maxPage; i++) {
      pages.push(getPageUrl(route, i))
    }
  })

  const params = {
    Message: 'Scrap',
    Subject: getPageUrl(routes[0], startPage),
    TopicArn: SNS_ARN
  }
  console.log(params)
  sns.publish(params, context.done)
}
