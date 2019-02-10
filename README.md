# Nietzsche

*"Morality is just a fiction used by the herd of inferior human beings to hold back the few superior men." - **Friedrich Nietzsche***

A [Serverless](https://serverless.com) application that fetches all quotes from [Goodreads](https://www.goodreads.com/quotes) and saves it to DynamoDb.

## Requirements

- Serverless CLI
- AWS CLI

## Usage

### Setup

- Get [Twitter API keys](https://developer.twitter.com/en/apps)
- `aws ssm put-parameter --name nietzsche-twitter-consumer-secret --type String --value $CONSUMER_SECRET --profile personal --overwrite --region eu-west-1`
- `aws ssm put-parameter --name nietzsche-twitter-consumer-key --type String --value $CONSUMER_KEY --profile personal --overwrite --region eu-west-1`
- `aws ssm put-parameter --name nietzsche-twitter-access-token --type String --value $ACCESS_TOKEN --profile personal --overwrite --region eu-west-1`
- `aws ssm put-parameter --name nietzsche-twitter-access-token-secret --type String --value $ACCESS_TOKEN_SECRET --profile personal --overwrite --region eu-west-1`
- `npm i`

### Deploy

`npm run deploy`

### Invoke

#### Local

- `npm run invoke:mine-local`
- `npm run invoke:mine-local-db`
- `npm run invoke:tweet-local`

#### Cloud

- `npm run invoke:mine`
- `npm run invoke:tweet`

### Logs

- `npm run logs:mine`
- `npm run logs:tweet`
