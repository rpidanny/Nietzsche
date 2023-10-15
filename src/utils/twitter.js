const got = require("got");
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");

const { maxTweetLength, twitterCredentials } = require("../config/twitter");

const endpointURL = `https://api.twitter.com/2/tweets`;

const oauth = OAuth({
  consumer: {
    key: twitterCredentials.appKey,
    secret: twitterCredentials.appSecret,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});

const commonTags = ["quote", "quoteoftheday"];

const cleanString = (text) => text.replace(/[^a-zA-Z0-9]/g, "");

const formatTweet = (quoteObj) => {
  const { text, author, tags } = quoteObj;
  const hashtags = [
    `#${cleanString(author.toLowerCase())}`,
    ...tags.map((tag) => `#${cleanString(tag)}`),
    ...commonTags.map((tag) => `#${tag}`),
  ];
  let tweetText = `"${text}" - ${author.replace(/,/g, "")}\n\n`;
  if (tweetText.length < maxTweetLength) {
    hashtags.forEach((tag) => {
      if (tweetText.length + tag.length <= maxTweetLength - 1) {
        tweetText += ` ${tag}`;
      }
    });
  }
  return tweetText;
};

async function postTweet(text) {
  const token = {
    key: twitterCredentials.accessToken,
    secret: twitterCredentials.accessSecret,
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "POST",
      },
      token
    )
  );

  const req = await got.post(endpointURL, {
    json: {
      text,
    },
    responseType: "json",
    headers: {
      Authorization: authHeader["Authorization"],
      "user-agent": "v2CreateTweetJS",
      "content-type": "application/json",
      accept: "application/json",
    },
  });
  if (req.body) {
    return req.body;
  } else {
    throw new Error("Unsuccessful request");
  }
}

module.exports = {
  formatTweet,
  postTweet,
};
