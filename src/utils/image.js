const fs = require('fs')
const request = require('request-promise')

const { promisify } = require('util')

const { execCmd } = require('./')
const { tmpPath } = require('../config/app')

const readFile = promisify(fs.readFile)

const download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    if (err) {
      callback(err)
    } else {
      console.log('content-type:', res.headers['content-type'])
      console.log('content-length:', res.headers['content-length'])
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    }
  })
}

const imageToB64 = image => new Promise((resolve, reject) => {
  readFile(image.path)
    .then(file => resolve(file.toString('base64')))
    .catch(err => reject(err))
})

const blurBackground = (background, outputImage) => new Promise((resolve, reject) => {
  const cmd = `convert \
  ${background} \
  -filter Gaussian \
  -blur 0x8 \
  ${outputImage}`
  execCmd(cmd)
    .then(() => resolve({
      path: outputImage
    }))
    .catch(err => reject(err))
})

const addQuoteToImage = (quote, background) => new Promise((resolve, reject) => {
  const { text, author } = quote
  const string = `"\u201C${text}\u201D\n\n-${author}"`
  const outputImage = `${tmpPath}/${new Date().getTime()}.png`
  const cmd = `convert \
  -size 1800x960 \
  -fill "#F5E5FC" \
  -font "DejaVu-Sans-Oblique" \
  -pointsize 36 \
  -background transparent \
  -undercolor black \
  -gravity center \
  -compose over \
  -composite ${outputImage}  \
  caption:${string} \
  ${outputImage}`

  blurBackground(background, outputImage)
    .then(() => execCmd(cmd))
    .then(() => resolve({
      path: outputImage
    }))
    .catch(err => reject(err))
})

const getRandomImage = () => new Promise((resolve, reject) => {
  const path = `${tmpPath}/${new Date().getTime()}_neitzsche_random.jpg`
  download(
    'https://unsplash.it/1920/1080/?random',
    path,
    err => {
      if (err) {
        reject(err)
      } else {
        resolve({ path })
      }
    })
})

module.exports = {
  blurBackground,
  addQuoteToImage,
  getRandomImage,
  imageToB64
}
