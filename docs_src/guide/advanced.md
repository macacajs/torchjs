# Advanced

## Trouble Shooting

### Using on Travis

Your .travis.yml will need two extra lines of configuration to run this headless on Travis:

```yaml
before_script:
  - export DISPLAY=:99.0; sh -e /etc/init.d/xvfb start
```

