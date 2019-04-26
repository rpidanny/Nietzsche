const { exec } = require('child_process')

const execCmd = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      reject(err)
    }
    resolve(stdout ? stdout : stderr)
  })
})

module.exports = {
  execCmd
}
