# 使用

## 主进程

```bash
$ torch test/main
```

## 渲染进程

```bash
$ torch --renderer test/renderer
```

## 交互模式

可以通过 `CMD+R` 重新运行

```bash
$ torch --interative test/renderer
```

> 监听源文件变化

```bash
$ torch --interactive --watch test/renderer
```

## 查看代码覆盖率

```bash
$ torch --coverage test/main && torch-coverage
```

## + Overalls

```bash
$ torch --coverage test/main && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
```

## 指定源文件

监听源文件变化 / 代码覆盖率

> 交互模式

```bash
$ torch --interactive --watch --source-pattern src/**/*.js test/renderer
```

> 代码覆盖率

```bash
$ torch --coverage --source-pattern src/**/*.js test/main && torch-coverage
```

