# 进阶

## 故障排除

### 在 Travis 中使用

在 .travis.yml 中添加以下配置：

```yaml
before_script:
  - export DISPLAY=:99.0; sh -e /etc/init.d/xvfb start
```

