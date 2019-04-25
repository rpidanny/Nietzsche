const crypto = require('crypto')

const dynamoDb = require('./utils/dynamodb')
const { success } = require('./utils/responses')

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

module.exports.saveQuotes = (event, context, callback) => {
  // Filter out duplicate items
  const records = {}
  event.Records.forEach(record => {
    const quote = JSON.parse(record.body)
    const id = md5(`${quote.author}-${quote.text}`)
    if (!records[id]) {
      records[id] = {
        quote,
        id
      }
    }
  })

  const quotes = Object.values(records)

  if (quotes.length > 0) {
    const params = {
      RequestItems: {}
    }

    const timestamp = Date.now().toString()

    params.RequestItems[process.env.DYNAMODB_TABLE] = quotes.map(item => {
      const { quote, id } = item
      return {
        PutRequest: {
          Item: {
            ...quote,
            // id,
            used: 0,
            createdAt: timestamp,
            updatedAt: timestamp
          }
        }
      }
    })
    dynamoDb.batchWrite(params, (err, data) => {
      if (err) {
        console.log(JSON.stringify(params, null, 2))
        // console.log(quotes.map(q => q.id))
        callback(err)
      } else {
        console.log(`Saved ${params.RequestItems[process.env.DYNAMODB_TABLE].length} to DB.`)
        callback(null, success(JSON.stringify(data, null, 2)))
      }
    })
  } else {
    callback(null)
  }
}
