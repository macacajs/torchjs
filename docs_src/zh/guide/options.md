# 选项

## 配置项

```
$ torch --help
  Usage: torch [options]
  Options
    -V, --·version                           output the version number
    -C, --no-colors                         force disabling of colors
    -O, --reporter-options <k=v,k2=v2,...>  reporter-specific options
    -R, --reporter <name>                   specify the reporter to use (default: spec)
    -S, --sort                              sort test files
    -b, --bail                              bail after first test failure
    -g, --grep <pattern>                    only run tests matching <pattern>
    -f, --fgrep <string>                    only run tests containing <string>
    -i, --invert                            inverts --grep and --fgrep matches
    -r, --require <name>                    require the given module (default: )
    -s, --slow <ms>                         "slow" test threshold in milliseconds [75]
    -t, --timeout <ms>                      set test-case timeout in milliseconds [2000]
    -u, --ui <name>                         specify user-interface (bdd|tdd|exports) (default: bdd)
    --check-leaks                           check for global variable leaks
    --compile                               compile with babel
    --compile-opts <path>                   path of compile options
    --compilers <ext>:<module>,...          use the given module(s) to compile files (default: )
    --coverage                              report coverage
    --debug                                 enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools
    --debug-brk                             like --debug but pauses the script on the first line
    --dom-global                            enable DOM in Node.js by using jsdom-global
    --dom-global-loose                      enable DOM in Node.js, while window can be modified
    --globals <names>                       allow the given comma-delimited global [names] (default: )
    --inline-diffs                          display actual/expected differences inline within each string
    --interactive                           run tests in renderer process in a visible window that can be reloaded to re-run tests
    --interfaces                            display available interfaces
    --no-timeouts                           disables timeouts
    --notify-on-fail                        notify on failures
    --notify-on-success                     notify on success
    --opts <path>                           specify opts path (default: test/mocha.opts)
    --preload <name>                        preload the given script in renderer process (default: )
    --recursive                             include sub directories
    --renderer                              run tests in renderer process
    --require-main <name>                   load the given script in main process before executing tests (default: )
    --source-pattern <sources>              glob pattern of source files (default: index.js,lib/**/*.js,src/**/*.js)
    --watch                                 watching source file changes
    --watch-aggregate-timeout               delay time for re-run test cases after files changed
    --http                                  switch it http protocol runtime
    -h, --help                              output usage information
```

## --compile-opts `<path>`

> experimental

specify a js file providing compile options. default path is `${process.cwd()}/.torch.compile.opts.js`

```javascript
module.exports = {
  babelrc: { // babelrc
    presets: [
      'es2015',
      'stage-0'
    ],
    sourceMaps: 'inline'
  },
  extensions: ['.es6', '.es', '.jsx', '.js'],
  include: [ // glob expressions to detect files to include
    'index.js',
    'lib/**/*.js',
    'src/**/*.js'
  ],
  exclude: [ // glob expressions to detect files to exclude
    'bower_components/**',
    'node_modules/**'
  ]
}
```

