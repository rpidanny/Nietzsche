const { formatTweet, postTweet } = require('./utils/twitter')

module.exports.handler = (event, context, callback) => {
  const quote = event

  if (quote) {
    const formattedTweet = formatTweet(quote)
    postTweet({
      status: formattedTweet
    })
      .then(() => callback(null, quote))
      .catch(callback)
  } else {
    callback(new Error('Invalid Data'))
  }
}
