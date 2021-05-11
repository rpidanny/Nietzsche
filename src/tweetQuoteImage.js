const { maxTweetLength, maxImageTweetLength } = require('./config/twitter')
const { LongQuoteError } = require('./utils/customErrors')

const { formatTweet, postImageTweet } = require('./utils/twitter')
const { getRandomImage, addQuoteToImage, imageToB64 } = require('./utils/image')

module.exports.handler = (event, context, callback) => {
  const quote = event

  if (quote) {
    const formattedTweet = formatTweet(quote)
    const tweetLength = quote.text.length + quote.author.length + 5

    if (tweetLength > maxImageTweetLength) {
      return callback(
        new LongQuoteError(
          `Quote is ${tweetLength} characters long. Supported image tweet length is ${maxImageTweetLength}`
        )
      )
    }

    getRandomImage()
      .then(img => {
        console.log('Image: ', img)
        return addQuoteToImage(
          {
            text: quote.text,
            author: quote.author.replace(/,/g, '')
          },
          img.path
        )
      })
      .then(imageToB64)
      .then(b64Image => {
        console.log('Base64 Image: ')
        console.log(b64Image)
        return postImageTweet({
          b64Image,
          status: tweetLength <= maxTweetLength ? formattedTweet : null
        })
      })
      .then(() => callback(null, quote))
      .catch(callback)
  } else {
    callback(new Error('Invalid Data'))
  }
}
