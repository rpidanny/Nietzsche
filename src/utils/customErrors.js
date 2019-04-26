function LongQuoteError (message) {
  this.name = 'LongQuoteError',
  this.message = message
}
function NoQuoteError (message) {
  this.name = 'NoQuoteError',
  this.message = message
}

LongQuoteError.prototype = new Error()
NoQuoteError.prototype = new Error()

module.exports = {
  LongQuoteError,
  NoQuoteError
}
