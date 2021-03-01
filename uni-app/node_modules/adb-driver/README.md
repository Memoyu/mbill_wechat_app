# adb-driver

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## usage

sample1

```javascript
const adbDriver = require('adb-driver')
const { execADBCommand } = adbDriver

execADBCommand(`adb devices`).then(result => {
  if (result instanceof Error) {
    console.error(`fail to execute adb devices`)
    return
  }
  console.info(`you can parse your devices info here: ${result}`)
})
```

sample2

```javascript
const adbDriver = require('adb-driver')
const { execADBCommand } = adbDriver

async function getDevices(callback) {
  const result = await execADBCommand(`adb devices`)
  if (result instanceof Error) {
    console.error(`fail to execute adb devices`)
    return callback(result)
  }
  console.log(`you can parse your devices info here`)
  callback(null, result)
}
```
