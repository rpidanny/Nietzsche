const { getRandomQuote } = require('./utils/quotes')
const { formatTweet, postTweet } = require('./utils/tweet')

module.exports.tweet = () => new Promise((resolve, reject) => {
  getRandomQuote()
    .then(quote => postTweet(formatTweet(quote)))
    .then(data => resolve(data))
    .catch(err => reject(err))
})
