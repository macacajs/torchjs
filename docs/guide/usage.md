# Usage

## Main process

```bash
$ torch test/main
```

## Renderer process

```bash
$ torch --renderer test/renderer
```

## Interactive mode

you can re-run tests by CMD+R

```bash
$ torch --interative test/renderer
```

> watching source files

```bash
$ torch --interactive --watch test/renderer
```

## View code coverage

```bash
$ torch --coverage test/main && torch-coverage
```

## + Overalls

```bash
$ torch --coverage test/main && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
```

## specify source files

for watching / code coverage

> interactive mode

```bash
$ torch --interactive --watch --source-pattern src/**/*.js test/renderer
```

> code coverage

```bash
$ torch --coverage --source-pattern src/**/*.js test/main && torch-coverage
```

