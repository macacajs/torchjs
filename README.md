# @lite-js/torch

Test framework to light up the world.

## installation

```shell
$ npm install @lite-js/torch [-g]
```

## usage

### main process

```shell
$ torch test/main
```

### renderer process

```shell
$ torch --renderer test/renderer
```

### interactive mode (you can re-run tests by CMD+R)

```shell
$ torch --interative test/renderer
```

> watching source files

```shell
$ torch --interactive --watch test/renderer
```

### view code coverage

```shell
$ torch --coverage test/main && torch-coverage
```

### + overalls

```shell
$ torch --coverage test/main && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
```

### specify source files (for watching / code coverage)

> interactive mode

```shell
$ torch --interactive --watch --source-pattern src/**/*.js test/renderer
```

> code coverage

```shell
$ torch --coverage --source-pattern src/**/*.js test/main && torch-coverage
```

## options

```shell
$ torch --help

  Usage: torch [options]

  Options:

    -h, --help                              output usage information
    -V, --version                           output the version number
    -C, --no-colors                         force disabling of colors
    -O, --reporter-options <k=v,k2=v2,...>  reporter-specific options
    -R, --reporter <name>                   specify the reporter to use
    -S, --sort                              sort test files
    -b, --bail                              bail after first test failure
    -g, --grep <pattern>                    only run tests matching <pattern>
    -f, --fgrep <string>                    only run tests containing <string>
    -i, --invert                            inverts --grep and --fgrep matches
    -r, --require <name>                    require the given module
    -s, --slow <ms>                         "slow" test threshold in milliseconds [75]
    -t, --timeout <ms>                      set test-case timeout in milliseconds [2000]
    -u, --ui <name>                         specify user-interface (bdd|tdd|exports)
    --check-leaks                           check for global variable leaks
    --compilers <ext>:<module>,...          use the given module(s) to compile files
    --coverage                              report coverage
    --debug                                 enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools
    --debug-brk                             like --debug but pauses the script on the first line
    --globals <names>                       allow the given comma-delimited global [names]
    --inline-diffs                          display actual/expected differences inline within each string
    --interactive                           run tests in renderer process in a visible window that can be reloaded to re-run tests
    --interfaces                            display available interfaces
    --no-timeouts                           disables timeouts
    --opts <path>                           specify opts path
    --preload <name>                        preload the given script in renderer process
    --recursive                             include sub directories
    --renderer                              run tests in renderer process
    --require-main <name>                   load the given script in main process before executing tests
    --source-pattern <sources>              glob pattern of source files
    --watch                                 watching source file changes
```

## trouble shooting

### using on Travis

Your .travis.yml will need two extra lines of configuration to run this headless on Travis:

```yaml
before_script:
  - export DISPLAY=:99.0; sh -e /etc/init.d/xvfb start
```

## thanks to

The original idea and most of the code are stolen from [electron-mocha](https://github.com/jprichardson/electron-mocha), actually you can say that `torch` is created by adding features onto `electron-mocha`.
