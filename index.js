const url = require('url');
const getOptions = require('mocha/bin/options');
const {
  assign,
  debounce,
  each,
  union,
  detectPort,
  ipv4
} = require('macaca-utils');
const {
  resolve,
  join,
  extname
} = require('path');
const {
  readFileSync,
  writeFileSync
} = require('fs');
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const {
  BrowserWindow,
  app,
  ipcMain
} = require('electron');
const Render = require('microtemplate').render;
const watch = require('./lib/watch');
const notify = require('./lib/notify');
const runMocha = require('./lib/runMocha');
const Coverage = require('./lib/Coverage');
const parseArgs = require('./lib/parseArgs');
const windowBoundsConfig = require('./lib/windowBoundsConfig')(resolve(app.getPath('userData'), './torch-config.json'));

const pkg = require('./package');

function fail (error) {
  console.error(error.message);
  console.error(error.stack);
  app.exit(1);
}

// load mocha.opts into process.argv
getOptions();

// opts
const opts = parseArgs(process.argv);
opts.root = process.cwd();

const isHttp = opts.http;
// `--require-main` scripts
if (opts.requireMain.length) {
  try {
    each(opts.requireMain, mainModule => {
      require(resolve(process.cwd(), mainModule));
    });
  } catch (error) {
    fail(error);
  }
}

let watcher;

app.on('window-all-closed', () => {
  if (watcher) {
    watcher.close();
  }
  app.quit();
});
app.on('ready', () => {
  if (opts.interactive) {
    opts.renderer = true;
    opts.debug = true;
    opts.reporter = 'HTML';
  }

  if (!opts.renderer) {
    let coverage;
    try {
      if (opts.coverage) {
        coverage = new Coverage(opts.root, opts.sourcePattern);
      }
      // TODO compile
      if (opts.compile) {
        require('./lib/requireHook')(opts.compileOpts);
      }
      runMocha(opts, count => {
        if (coverage) {
          coverage.report();
        }
        if (count && opts.notifyOnFail) {
          notify(count);
        }
        if (count && opts.notifyOnSuccess) {
          notify(count);
        }
        app.exit(count);
      });
    } catch (error) {
      fail(error);
    }
  } else {
    const winOpts = {
      focusable: opts.debug,
      height: opts.height,
      show: false,
      width: opts.width,
      webPreferences: {
        webSecurity: false
      }
    };
    assign(winOpts, windowBoundsConfig.get('main'));
    let win = new BrowserWindow(winOpts);

    win.on('close', () => {
      windowBoundsConfig.set('main', win.getBounds());
    });
    win.on('closed', () => {
      win = null;
    });
    win.webContents.once('did-finish-load', () => {
      if (opts.debug) {
        win.show();
        win.webContents.openDevTools();
        win.webContents.on('devtools-opened', () => {
          win.webContents.send('mocha-start');
        });

        // Called on reload in --interactive mode
        ipcMain.on('mocha-ready-to-run', () => {
          win.webContents.send('mocha-start');
        });
      } else {
        win.webContents.send('mocha-start');
      }
    });

    if (opts.interactive && opts.watch) {
      watcher = watch(
        union(opts.sourcePattern, opts.files),
        debounce(() => {
          win.webContents.reloadIgnoringCache();
        }, opts.watchAggregateTimeout)
      );
    }

    ipcMain.on('mocha-done', (event, count) => {
      win.webContents.once('destroyed', () => app.exit(count));
      if (!opts.interactive) {
        win.close();
      }
    });
    ipcMain.on('mocha-error', (_, error) => fail(error));

    ipcMain.on('screenshot-start', (event, options) => {
      if (options.width && options.height) {
        let config = {
          x: options.x || 0,
          y: options.y || 0,
          width: options.width,
          height: options.height
        };
        win.capturePage(config, image => {
          let data = image.toDataURL();
          let base64 = data.split(',')[1];
          win.webContents.send('screenshot-end', {
            base64
          });
        });
      } else {
        win.capturePage(image => {
          let data = image.toDataURL();
          let base64 = data.split(',')[1];
          win.webContents.send('screenshot-end', {
            base64
          });
        });
      }
    });

    const renderDir = join(__dirname, './renderer');
    const distfile = join(renderDir, './index.html');
    const templatefile = join(renderDir, './template.html');

    // default inject mocha.css
    opts.preload.push(join('mocha.css'));

    const getInjectContent = list => {
      let html = '';
      list.forEach(item => {
        const ext = extname(item);

        switch (ext) {
        case '.js':
          html += `<script src="${item}"></script>`;
          break;
        case '.css':
          html += `<link rel="stylesheet" href="${item}"/>`;
          break;
        }
      });
      return html;
    };
    const output = Render(readFileSync(templatefile, 'utf8'), {
      title: pkg.name,
      preload: getInjectContent(opts.preload),
      // runner: `<script src="${join(renderDir, 'run.js')}"></script>`
      runner: `<script>require('${join(renderDir, 'run.js').replace(/\\/g, '/')}');</script>` // NOTE: to make module loading work in windows
    }, {
      tagOpen: '<!--',
      tagClose: '-->'
    });
    writeFileSync(distfile, output, 'utf8');

    if (!opts.debug && process.platform === 'darwin') {
      app.dock.hide();
    }

    if (isHttp) {
      const serve = serveStatic(renderDir, {
        index: [
          'index.html'
        ]
      });
      const server = http.createServer((req, res) => {
        serve(req, res, finalhandler(req, res));
      });

      // Listen
      detectPort((err, port) => {
        if (err) {
          console.log(err);
          return;
        }
        server.listen(port);

        win.loadURL(url.format({
          hash: encodeURIComponent(JSON.stringify(opts)),
          pathname: '/',
          port: port,
          hostname: ipv4,
          protocol: 'http'
        }));
      });
    } else {
      win.loadURL(url.format({
        hash: encodeURIComponent(JSON.stringify(opts)),
        pathname: distfile,
        protocol: 'file:',
        slashes: true
      }));
    }
  }
});
