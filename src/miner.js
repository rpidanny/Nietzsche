const rp = require('request-promise');
const $ = require('cheerio');

const baseURL = 'https://www.goodreads.com/quotes?format=json'

const quotesUrl = page => `${baseURL}&page=${page}`

module.exports.getQuotes = async (page) =>
new Promise((resolve, reject) => {
  rp(quotesUrl(page))
    .then(data => JSON.parse(data).content_html)
    .then(html => {
      const quotes = []
      const quoteGroup = $('.quote', html)

      quoteGroup.each((idx, elem) => {
        const quoteElement = $(elem)
        const text = quoteElement.find('.quoteBody').text().replace(/^\s+|\s+$/g, "")
        const author = quoteElement.find('.quoteAuthor').text().replace(/^\s+|\s+$/g, "")
        const likes = quoteElement.find('.likesCount').text().replace(/^\s+|\s+$/g, "")
        const tags = quoteElement.find('.quoteTags')
          .find('a')
          .map((idx, tag) => {
            const tagSelector = $(tag)
            return {
              link: tagSelector.attr('href'),
              text: tagSelector.text().replace(/^\s+|\s+$/g, "")
            }
          }).toArray()

        quotes.push({
          text,
          author,
          likes,
          tags
        })
      })
      resolve(quotes)
    })
    .catch(function(err) {
      reject(err)
    });
})
