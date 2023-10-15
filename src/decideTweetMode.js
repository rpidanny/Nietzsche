const { maxTweetLength } = require("./config/twitter");
const { NoQuoteError, LongQuoteError } = require("./utils/customErrors");

module.exports.handler = async (event) => {
  const { text, author } = event;
  console.log(event);

  if (!text && !author) {
    throw new NoQuoteError("No Quote in input to function.");
  }

  const tweetLength = text.length + author.length + 7;

  if (tweetLength > maxTweetLength) {
    throw new LongQuoteError("Quote is too long to tweet.");
  }

  return {
    ...event,
    mode: "text",
  };
};
