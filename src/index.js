module.exports.main = (event, context, callback) => {
  return callback(null, {
    statusCode: 200,
    body: {
      data: 'ok'
    }
  })
}
