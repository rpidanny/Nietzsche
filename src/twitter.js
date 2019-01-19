const Twit = require('twit')

const dynamoDb = require('./utils/dynamodb')

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

const formatTweet = (quote, author, tags) => `"${quote}" - ${author} \n\n#${author.replace(/ +/g, '').toLowerCase()} ${tags.map(tag => `#${tag.text}`).join(' ')} ${commonTags.map(tag => `#${tag}`).join(' ')}`

module.exports.tweet = () =>
  new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: '#tweeted <> :flag',
      ExpressionAttributeNames: {
        '#tweeted': 'tweeted'
      },
      ExpressionAttributeValues: {
        ':flag': true
      }
    }
    dynamoDb.scan(params, (err, result) => {
      if (err) {
        reject(err)
      } else {
        const { Items, Count } = result
        const index = Math.floor(Math.random() * Count)
        const quote = Items[index]
        const tweet = formatTweet(quote.text, quote.author, quote.tags)
        console.log('Tweet', tweet)

        // tweet the quote
        Twitter.post('statuses/update', { status: 'Hello World!' }, (err, data, response) => {
          if (err) {
            reject(err)
          } else {
            // set quote as tweeted
            const params2 = {
              TableName: process.env.DYNAMODB_TABLE,
              Key: {
                id: quote.id
              },
              ExpressionAttributeNames: {
                '#tweeted': 'tweeted'
              },
              ExpressionAttributeValues: {
                ':flag': true
              },
              UpdateExpression: 'SET #tweeted = :flag',
              ReturnValues: 'ALL_NEW'
            }
            dynamoDb.update(params2, (err, res) => {
              if (err) {
                reject(err)
              } else {
                resolve(tweet)
              }
            })
          }
        })
      }
    })
  })
