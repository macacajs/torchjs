const chokidar = require('chokidar')

module.exports = (globs, callback) => {
  const watcher = chokidar.watch(globs, {
    ignored: [
      /(^|[/\\])\../,
      /node_modules|[/\\]\./
    ]
  })

  watcher.on('all', callback)

  return watcher
}
