var { store, excavate, DirtError, logError } = require('./helpers')
var { user } = require('./user.json')

function work() {
  excavate()
    .then(payload => {
      if (payload.gold) return payload
      return Promise.reject(new DirtError())
    })
    .then(({ bucketId }) => store(user, bucketId))
    .catch(logError)
    .then(work)
}

work()
