const Twit = require('twit')
const { maxTweetLength, twitterCredentials } = require('../config/twitter')

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
    ...tags.map(tag => `#${cleanString(tag)}`),
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

const postTweet = (tweet) => new Promise((resolve, reject) => {
  Twitter.post('statuses/update', tweet, (err, data, response) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

const postImageTweet = data => new Promise((resolve, reject) => {
  Twitter.post('media/upload', { media_data: data.b64Image }, (err, data, response) => {
    if (err) {
      reject(err)
    } else {
      console.log('Image Uploaded')
      console.log('Tweeting it...')
      postTweet({
        status: data.status,
        media_ids: new Array(data.media_id_string)
      })
        .then(data => resolve(data))
        .catch(err => reject(err))
    }
  })
})

module.exports = {
  formatTweet,
  postTweet,
  postImageTweet
}
