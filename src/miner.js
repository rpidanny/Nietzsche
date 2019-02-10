const crypto = require('crypto')
const rp = require('request-promise')
const A4js = require('a4js')
const $ = require('cheerio')

const dynamoDb = require('./utils/dynamodb')

const { maxPage, startPage, routes } = require('./config')

const md5 = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

// const baseURL = 'https://www.goodreads.com/quotes?format=json'
const baseURL = 'https://www.goodreads.com'

const quotesUrl = (route, page) => `${baseURL}${route}?format=json&page=${page}`

const fetchQuotes = (route, page) =>
  new Promise((resolve, reject) => {
    rp(quotesUrl(route, page))
      .then(data => JSON.parse(data).content_html)
      .then(html => {
        const quotes = []
        const quoteGroup = $('.quote', html)

        quoteGroup.each((idx, elem) => {
          const quoteElement = $(elem)
          const text = quoteElement
            .find('.quoteBody')
            .text()
            .replace(/^\s+|\s+$/g, '')
          const author = quoteElement
            .find('.quoteAuthor')
            .text()
            .replace(/^\s+|\s+$/g, '')
          const likes = parseInt(
            quoteElement
              .find('.likesCount')
              .text()
              .replace(/^\s+|\s+$/g, '')
          )
          const tags = quoteElement
            .find('.quoteTags')
            .find('a')
            .map((idx, tag) => {
              const tagSelector = $(tag)
              return {
                link: tagSelector.attr('href'),
                text: tagSelector.text().replace(/^\s+|\s+$/g, '')
              }
            })
            .toArray()

          quotes.push({
            text,
            author,
            likes,
            tags
          })
        })
        return quotes
      })
      .then(quotes => {
        // save to db
        return quotes.reduce(
          (chain, quote) =>
            chain.then(acc => {
              const id = md5(`${quote.author}-${quote.text}`)
              const params = {
                TableName: process.env.DYNAMODB_TABLE,
                Item: {
                  ...quote,
                  id
                }
              }
              return Promise.resolve(
                new Promise((resolve, reject) => {
                  dynamoDb.put(params, (error, data) => {
                    if (error) {
                      reject(error)
                    } else {
                      resolve(data)
                    }
                  })
                })
              )
                .then(data => {
                  const tmp = acc.success.concat([data])
                  acc.success = tmp
                  return acc
                })
                .catch(err => {
                  const tmp = acc.failures.concat([err])
                  acc.failures = tmp
                  return acc
                })
            }),
          Promise.resolve({
            success: [],
            failures: []
          })
        )
      })
      .then(response => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })

const fetchQuoteByRoute = route => new Promise(async (resolve, reject) => {
  try {
    for (let page = startPage; page < maxPage + 1; page++) {
      await fetchQuotes(route, page)
      console.log(`Route: ${route}, Page: ${page} complete`)
      if (page === maxPage) {
        resolve()
      }
    }
  } catch (err) {
    reject(err)
  }
})

module.exports.mineQuotes = () => new Promise(async (resolve, reject) => {
  const miner = new A4js(fetchQuoteByRoute, 'FIFO', true)
  routes.forEach((route, idx) => {
    if (idx === (routes.length - 1)) {
      miner
        .add([route], { name: route })
        .then(() => {
          console.log(`Route: ${route} completed`)
          resolve()
        })
        .catch(err => {
          console.log(`Route: ${route} failed`)
          console.log(err)
        })
    } else {
      miner
        .add([route], { name: route })
        .then(() => console.log(`Route: ${route} completed`))
        .catch(err => {
          console.log(`Route: ${route} failed`)
          console.log(err)
        })
    }
  })
})
