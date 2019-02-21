const { getRandomQuote } = require('./utils/quotes')
const { formatTweet, postTweet, postImageTweet } = require('./utils/tweet')
const { generateImage, imageToB64 } = require('./utils/image')

module.exports.tweet = () => new Promise((resolve, reject) => {
  getRandomQuote()
    .then(quote => postTweet({ status: formatTweet(quote) }))
    .then(data => resolve(data))
    .catch(err => reject(err))
})

module.exports.tweetImage = () => new Promise((resolve, reject) => {
  getRandomQuote()
    .then(quote => generateImage(quote, 'mountain.jpg'))
    .then(imageToB64)
    .then(postImageTweet)
    .then(resolve)
    .catch(reject)
})
