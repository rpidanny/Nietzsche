const { formatTweet, postTweet } = require("./utils/twitter");

module.exports.handler = async (event) => {
  const quote = event;

  if (!quote) {
    throw new Error("Invalid Data");
  }

  const formattedTweet = formatTweet(quote);
  await postTweet(formattedTweet);
  return quote;
};
