# Nietzsche

*"Morality is just a fiction used by the herd of inferior human beings to hold back the few superior men." - **Friedrich Nietzsche***

A [Serverless](https://serverless.com) application that fetches all quotes from [Goodreads](https://www.goodreads.com/quotes) and saves it to DynamoDb.

## Requirements

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
2. [Serverless](https://serverless.com)

## Setup

1. Get [Twitter API keys](https://developer.twitter.com/en/apps)
2. `aws ssm put-parameter --name nietzsche-twitter-consumer-secret --type String --value $CONSUMER_SECRET --profile personal --overwrite --region eu-west-1`
3. `aws ssm put-parameter --name nietzsche-twitter-consumer-key --type String --value $CONSUMER_KEY --profile personal --overwrite --region eu-west-1`
4. `aws ssm put-parameter --name nietzsche-twitter-access-token --type String --value $ACCESS_TOKEN --profile personal --overwrite --region eu-west-1`
5. `aws ssm put-parameter --name nietzsche-twitter-access-token-secret --type String --value $ACCESS_TOKEN_SECRET --profile personal --overwrite --region eu-west-1`
6. `npm i`

## Deploy

`npm run deploy`

## Invoke

Fetching quotes and saving it to DynamoDb takes more time than the max timeout of lambda (900s) so it's better if you run the mine function locally.

### Local

- `npm run invoke:mine-local`
- `npm run invoke:mine-local-db`
- `npm run invoke:tweet-local`

### Cloud

- `npm run invoke:mine`
- `npm run invoke:tweet`

## Logs

- `npm run logs:mine`
- `npm run logs:tweet`
