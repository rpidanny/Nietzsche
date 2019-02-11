const Twit = require('twit')
const { maxTweetLength, twitterCredentials } = require('../config')

const Twitter = new Twit(twitterCredentials)

const commonTags = [
  'quote',
  'quoteoftheday'
]

const cleanString = text => text.replace(/[^a-zA-Z0-9]/g, '')

const formatTweet = quoteObj => {
  const { text, author, tags } = quoteObj
  const hashtags = [
    `#${cleanString(author.toLowerCase())}`,
    ...tags.map(tag => `#${cleanString(tag.text)}`),
    ...commonTags.map(tag => `#${tag}`)
  ]
  let tweetText = `"${text}" - ${author.replace(/,/g, '')}\n\n`
  if (tweetText.length < maxTweetLength) {
    hashtags.forEach(tag => {
      if (tweetText.length + tag.length <= maxTweetLength - 1) {
        tweetText += ` ${tag}`
      }
    })
  }
  return tweetText
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
