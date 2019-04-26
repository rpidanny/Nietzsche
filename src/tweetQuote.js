const { maxTweetLength } = require('./config/twitter')

const { formatTweet, postTextTweet, postImageTweet } = require('./utils/twitter')
const { generateImage, imageToB64 } = require('./utils/image')

module.exports.handler = (event, context, callback) => {
  // const quote = event.quote
  const quote = {
    likes: 2417,
    updatedAt: '1556205736471',
    createdAt: '1556205736471',
    text:
      'When the snows fall and the white winds blow, the lone wolf dies but the pack survives.',
    used: 0,
    quoteId: '214e857d1df74a32b7141f532514d16d',
    tags: ['friendship', 'loneliness'],
    author: 'George R.R. Martin'
  }

  if (quote.text.length + quote.author.length <= maxTweetLength + 3) {
    postTextTweet({
      status: formatTweet(quote)
    })
      .then(() => callback(null, quote))
      .catch(callback)
  } else {
    generateImage({
      text: quote.text,
      author: quote.author.replace(/,/g, '')
    }, 'bg2.jpg')
      .then(imageToB64)
      .then(postImageTweet)
      .then(() => callback(null, quote))
      .catch(callback)
  }
}
