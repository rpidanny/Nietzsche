const { maxTweetLength } = require('./config/twitter')

// const { LongQuoteError } = require('./utils/customErrors')
const { formatTweet, postTweet, postImageTweet } = require('./utils/twitter')
const { getRandomImage, addQuoteToImage, imageToB64 } = require('./utils/image')

const getTweetChoice = () => {
  // random variable to decide either to tweet text or image
  // probability of text = 3/4
  // probability of image = 1/4
  const randomNumber = Math.floor(Math.random() * Math.floor(4))
  return randomNumber < 3
}

module.exports.handler = (event, context, callback) => {
  const quote = event
  const tweetImageFlag = getTweetChoice()

  if (quote) {
    const formattedTweet = formatTweet(quote)
    const tweetLength = quote.text.length + quote.author.length + 5
    if (tweetLength <= maxTweetLength && tweetImageFlag) {
      postTweet({
        status: formattedTweet
      })
        .then(() => callback(null, quote))
        .catch(callback)
    } else {
      // callback(new LongQuoteError('Quote too long to tweet.'))
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
    }
  } else {
    callback(new Error('Invalid Data'))
  }
}
