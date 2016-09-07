# Electron template

Electron v1.3.1

## Using `serialport`

Write npm script to `package.json`. `--target=x.x.x` is Electron version.

```
"postinstall": "cd node_modules/serialport && ./node_modules/.bin/node-pre-gyp rebuild --target=1.3.1 --arch=x64 --dist-url=https://atom.io/download/atom-shell",
```