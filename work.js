var { store, excavate, DirtError, logError } = require('./helpers')
var { user } = require('./user.json')

var work = workers => () => {

  Array(workers).fill().forEach(() => {
    excavate()
      .then(payload => {
        if (payload.gold) return payload
        return Promise.reject(new DirtError())
      })
      .then(({ bucketId }) => store(user, bucketId))
      .catch(logError)
      .then(work(1))
  })
}

work(10)()
