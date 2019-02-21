const fs = require('fs')
const { promisify } = require('util')

const { execCmd } = require('./')
const { rootPath } = require('../config/app')

const readFile = promisify(fs.readFile)

const imageToB64 = image => new Promise((resolve, reject) => {
  readFile(image.path)
    .then(file => resolve(file.toString('base64')))
    .catch(err => reject(err))
})

const generateImage = (quote, background) => new Promise((resolve, reject) => {
  const { text, author } = quote
  const string = `"\u201C${text}\u201D\n\n-${author}"`
  const cmd = `printf ${string} | \
  convert \
  -size 399x399 \
  -fill "#F5E5FC" \
  -font Times-New-Roman \
  -pointsize 18 \
  -background transparent \
  -gravity center \
  -compose over \
  -composite ${rootPath}/src/assets/images/${background}  \
  caption:@- \
  quote.png`
  execCmd(cmd)
    .then(() => resolve({
      path: `${rootPath}/quote.png`
    }))
    .catch(err => reject(err))
})

module.exports = {
  generateImage,
  imageToB64
}
