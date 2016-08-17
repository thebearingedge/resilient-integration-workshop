var fs = require('fs')
var { store, excavate } = require('.')

var userJSON = fs.readFileSync(__dirname + '/user.json', 'utf8')
var { user } = JSON.parse(userJSON)


function work() {
  excavate()
    .then(({ bucketId }) => store(user, bucketId))
    .then(work)
    .catch(work)
}


work()
