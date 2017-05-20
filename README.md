# Electron template

* Electron v1.6.6
* Webpack v2.5.1
* React v15.5.4

## Native Module Error

```bash
#!/bin/bash

home=`pwd`
version=`electron -v`
version=${version:1}

for dir in 'serialport'
do
    cd node_modules/$dir
	HOME=~/.electron-gyp node-gyp rebuild --target=$version --arch=x64 --dist http://atom.io/download/atom-shell
	cd "$home"
done
```
