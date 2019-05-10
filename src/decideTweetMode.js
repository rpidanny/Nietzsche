const { maxTweetLength } = require('./config/twitter')
const { NoQuoteError } = require('./utils/customErrors')

/**
 * Random variable to decide either to tweet text or image
 * Probability of text = 3/4
 * Probability of image = 1/4
 * */
const getTweetChoice = () => {
  const randomNumber = Math.floor(Math.random() * Math.floor(4))
  return randomNumber < 3
}

module.exports.handler = (event, context, callback) => {
  const { text, author } = event
  console.log(event)
  if (text && author) {
    const tweetImageFlag = getTweetChoice()
    const tweetLength = event.text.length + event.author.length + 7
    callback(null, {
      ...event,
      mode: tweetLength <= maxTweetLength && tweetImageFlag ? 'text' : 'image'
    })
  } else {
    callback(new NoQuoteError('No Quote in input to function.'))
  }
}
