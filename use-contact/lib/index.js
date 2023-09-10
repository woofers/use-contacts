if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./use-contacts.dev.js')
}
else {
  module.exports = require('./use-contacts.js')
}
