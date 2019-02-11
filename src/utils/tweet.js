const Twit = require('twit')

const credentials = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const Twitter = new Twit(credentials)
const commonTags = [
  'quote',
  'quoteoftheday',
  'inspiration',
  'motivation',
  'quotetweet'
]

const formatTweet = quoteObj => {
  const { text, author, tags } = quoteObj
  return `"${text}" - ${author} \n\n#${author.replace(/ +/g, '').toLowerCase()} ${tags.map(tag => `#${tag.text}`).join(' ')} ${commonTags.map(tag => `#${tag}`).join(' ')}`
}

const postTweet = text => new Promise((resolve, reject) => {
  Twitter.post('statuses/update', { status: text }, (err, data, response) => {
    if (err) {
      reject(err)
    } else {
      resolve(text)
    }
  })
})

module.exports = {
  formatTweet,
  postTweet
}
