const { maxTweetLength } = require('./config/twitter')

const { formatTweet, postImageTweet } = require('./utils/twitter')
const { getRandomImage, addQuoteToImage, imageToB64 } = require('./utils/image')

process.env.FONTCONFIG_PATH = '/var/task/src/assets/fonts'

module.exports.handler = (event, context, callback) => {
  const quote = event

  if (quote) {
    const formattedTweet = formatTweet(quote)
    const tweetLength = quote.text.length + quote.author.length + 5
    getRandomImage()
      .then(img => addQuoteToImage({
        text: quote.text,
        author: quote.author.replace(/,/g, '')
      }, img.path))
      .then(imageToB64)
      .then(b64Image => postImageTweet({
        b64Image,
        status: tweetLength <= maxTweetLength ? formattedTweet : null
      }))
      .then(() => callback(null, quote))
      .catch(callback)
  } else {
    callback(new Error('Invalid Data'))
  }
}
