const { maxTweetLength } = require('./config/twitter')

const { LongQuoteError } = require('./utils/customErrors')
const { formatTweet, postTweet } = require('./utils/twitter')
// const { generateImage, imageToB64 } = require('./utils/image')

module.exports.handler = (event, context, callback) => {
  const quote = event

  if (quote) {
    if (quote.text.length + quote.author.length <= maxTweetLength + 3) {
      postTweet({
        status: formatTweet(quote)
      })
        .then(() => callback(null, quote))
        .catch(callback)
    } else {
      callback(new LongQuoteError('Quote too long to tweet.'))
      // generateImage({
      //   text: quote.text,
      //   author: quote.author.replace(/,/g, '')
      // }, 'bg2.jpg')
      //   .then(imageToB64)
      //   .then(postImageTweet)
      //   .then(() => callback(null, quote))
      //   .catch(callback)
    }
  } else {
    callback(new Error('Invalid Data'))
  }
}
