var request = require('request-promise')
var fs = require('fs')
var API = 'https://resilient-integration-workshop.herokuapp.com/v1'

// POST /register?userName=X
// POST /excavate
// POST /store?userId=X&bucketId=X
// GET /totals?userId=X

function createUser(userName) {
  request({
    method: 'POST',
    url: `${API}/register?userName=${userName}`,
    json: true
  })
  .then(writeJSON('user'))
  .catch(logError)
}

function getTotals(userId) {
  request({
    method: 'GET',
    url: `${API}/totals?userId=${userId}`,
    json:true
  })

  .then(writeJSON('totals'))
  .catch(logError)
}

function excavate() {
  return request({
    method: 'POST',
    url: `${API}/excavate`,
    json: true,
    timeout: 300
  })
  /* eslint-disable no-console */
  .then(payload => console.log(payload) || payload)
  /* eslint-enable no-console */
}

function store(userId, bucketId) {
  return request({
    method: 'POST',
    url: `${API}/store?userId=${userId}&bucketId=${bucketId}`,
    json: true,
    timeout: 300
  })
}

function DirtError() {
  Error.captureStackTrace(this, this.constructor)
  this.message = 'OH NO, DIRT!'
}

function writeJSON(filename) {
  return function (json) {
    return new Promise((resolve, reject) => {
      var filepath = `${__dirname}/${filename}.json`
      fs.writeFile(filepath, JSON.stringify(json, null, 2), err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

function logError(err) {
  var { name, message, stack } = err
  var logEntry = `${name} ${message}\n${stack}`
  fs.appendFile(`${__dirname}/error.log`, logEntry, err => {
    /* eslint-disable no-console */
    if (err) console.error(err)
    /* eslint-enable no-console */
  })
}

module.exports = { createUser, getTotals, excavate, store, DirtError, logError }
