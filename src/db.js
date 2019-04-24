const crypto = require('crypto')

const dynamoDb = require('./utils/dynamodb')
const { success, failure } = require('./utils/responses')

const md5 = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

// const quotesToDb = (quotes) => {
//   return quotes.reduce(
//     (chain, quote) =>
//       chain.then(acc => {
//         const id = md5(`${quote.author}-${quote.text}`)
//         const params = {
//           TableName: process.env.DYNAMODB_TABLE,
//           Item: {
//             ...quote,
//             id
//           }
//         }
//         return Promise.resolve(
//           new Promise((resolve, reject) => {
//             dynamoDb.put(params, (error, data) => {
//               if (error) {
//                 reject(error)
//               } else {
//                 resolve(data)
//               }
//             })
//           })
//         )
//           .then(data => {
//             const tmp = acc.success.concat([data])
//             acc.success = tmp
//             return acc
//           })
//           .catch(err => {
//             const tmp = acc.failures.concat([err])
//             acc.failures = tmp
//             return acc
//           })
//       }),
//     Promise.resolve({
//       success: [],
//       failures: []
//     })
//   )
// }

module.exports.saveQuote = (event, context, callback) => {
  const params = {
    RequestItems: {}
  }
  params.RequestItems[process.env.DYNAMODB_TABLE] = event.Records.map(record => {
    const quote = JSON.parse(record.body)
    const id = md5(`${quote.author}-${quote.text}`)
    return {
      PutRequest: {
        Item: {
          ...quote,
          id,
          notified: false
        }
      }
    }
  })
  dynamoDb.batchWrite(params, (err, data) => {
    if (err) {
      callback(err)
    } else {
      console.log(`Saved ${params.RequestItems[process.env.DYNAMODB_TABLE].length} to DB.`)
      callback(null, success(JSON.stringify(data, null, 2)))
    }
  })
}
