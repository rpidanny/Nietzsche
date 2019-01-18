
const buildResponse = (statusCode, body) => {
  return {
    statusCode,
    body: JSON.stringify(body)
  }
}

module.exports.success = (body) => {
  return buildResponse(200, body)
}

module.exports.failure = (body) => {
  return buildResponse(500, body)
}
