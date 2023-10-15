module.exports = {
  maxTweetLength: 280,
  twitterCredentials: {
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_OAUTH_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_OAUTH_ACCESS_TOKEN_SECRET,
  },
};
