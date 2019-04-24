const rp = require('request-promise')
const $ = require('cheerio')

// const cleanString = text => text.replace(/[^a-zA-Z0-9]/g, '')

const fetchQuotes = (pageURL) =>
  new Promise((resolve, reject) => {
    rp(pageURL)
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
            .replace(/,/g, '')
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
              return tagSelector.text().replace(/^\s+|\s+$/g, '')
              // return {
              //   link: tagSelector.attr('href'),
              //   text: tagSelector.text().replace(/^\s+|\s+$/g, '')
              // }
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
        resolve(quotes)
      })
      .catch((err) => {
        reject(err)
      })
  })

module.exports = {
  fetchQuotes
}
