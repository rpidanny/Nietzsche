const { maxTweetLength } = require('./config/twitter')
const { NoQuoteError } = require('./utils/customErrors')

/**
 * Random variable to decide either to tweet text or image
 * Probability of text = 4/5
 * Probability of image = 1/5
 * */
// const getTweetChoice = () => {
//   const randomNumber = Math.floor(Math.random() * Math.floor(5))
//   return randomNumber < 4
// }

const getTweetLength = quote => {
  return (
    quote.text.length +
    quote.author.length * 2 + // author is repeated twice one in quote, once in hashtags
    quote.tags.reduce((acc, cur) => acc + 1 + cur.length, 0) + // tags are used as hashtags
    quote.tags.length // spaces between hashtags
  )
}

module.exports.handler = (event, context, callback) => {
  const { text, author } = event
  console.log(event)
  if (text && author) {
    const tweetLength = getTweetLength(event)
    callback(null, {
      ...event,
      mode: tweetLength <= maxTweetLength ? 'text' : 'image'
    })
  } else {
    callback(new NoQuoteError('No Quote in input to function.'))
  }
}
