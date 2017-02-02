# Electron template

* Electron v1.4.0
* Webpack

## Using `serialport`

Write npm script to `package.json`. `--target=x.x.x` is Electron version.

```
"postinstall": "cd node_modules/serialport && ./node_modules/.bin/node-pre-gyp rebuild --target=1.3.1 --arch=x64 --dist-url=https://atom.io/download/atom-shell",
```

## Native Module Error

```bash
npm install -g node-gyp
cd node_modules/${moduleName}
HOME=~/.electron-gyp node-gyp rebuild --target=`npm view electron version` --arch=x64 --dist http://atom.io/download/atom-shell
```
