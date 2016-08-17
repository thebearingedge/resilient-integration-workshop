var request = require('request-promise')
var fs = require('fs')
var API = 'https://resilient-integration-workshop.herokuapp.com'

// POST /v1/register?userName=X
//
var userName = 'team-kickass'

exports.createUser = function createUser() {
  request({
    method: 'POST',
    json: true,
    url: `${API}/v1/register?userName=${userName}`
  })
  .then(json => new Promise((resolve, reject) => {
    fs.writeFile(__dirname + '/user.json', JSON.stringify(json), err => {
      if (err) return reject(err)
      resolve()
    })
  }))
}

// POST /v1/excavate

exports.excavate = function excavate() {
  return request({
    method: 'POST',
    json: true,
    url: `${API}/v1/excavate`,
    timeout: 300
  })
}


// POST /v1/store?userId=X&bucketId=X

exports.store = function store(userId, bucketId) {
  // read the creds from disk
  return request({
    method: 'POST',
    json: true,
    url: `${API}/v1/store?userId=${userId}&bucketId=${bucketId}`,
    timeout: 300
  })
  .then(({ bucketId, gold }) => {
    if (!gold) return Promise.reject('DIRT!!!!')
    return { bucketId, gold }
  })
  .then(writeJSON('store'))
  .catch(logError)
}


function writeJSON(filename) {
  return function (json) {
    /* eslint-disable no-console */
    return new Promise((resolve, reject) => {
      fs.writeFile(`${__dirname}/${filename}.json`, JSON.stringify(json, null, 2), reject)
    })
  }
}

function logError(err) {
  if (!err) return
  fs.appendFile(`${__dirname}/errors`, err.message + err.stack + '\n', err => {
    /* eslint-disable no-console */
    console.error(err)
  })
}

// GET /v1/totals?userId=X
