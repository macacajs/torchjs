const notifier = require('node-notifier')

module.exports = errorCount => {
  if (errorCount) {
    notifier.notify({
      title: 'Failed',
      message: `${errorCount} ${errorCount === 1 ? 'test' : 'tests'} failed.`
    })
  }
}
