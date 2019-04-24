# Nietzsche

A [Serverless](https://serverless.com) application that fetches all quotes from [Goodreads](https://www.goodreads.com/quotes) and saves it to [DynamoDB](https://aws.amazon.com/dynamodb). *(About 74K unique quotes)*

It also has a function to tweet random quotes.

## Architecture

![logo](./architecture.png "Architecture Diagram")

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

`serverless invoke -f invokeScrappers`

*"Morality is just a fiction used by the herd of inferior human beings to hold back the few superior men." - **Friedrich Nietzsche***
