# Easy log

## Simple, combustible and pluggable logger for browser

With easy log, you can have your own logger and add all the functions that you want.
You can set log levels, fallbacks and so one. 

At the end the logger is just a function that modify itself based on your needs

### Installation

With `npm`
```bash
npm i --save @ematipico/easy-log
```
With `yarn`
```bash
yarn add @ematipico/easy-log
```

### Create a logger

```js
import { createLogger } from 'easy-log'
const AppLogger = createLogger()
AppLogger.critical('There\'s an error here!')

// [CRITICAL] There's an error here!
```

### Personlise it

When creating your logger, you can pass the default level of your logging and an object where you can persolise you logging. Let's see how

```js
import { createLogger } from 'easy-log'
const levels = {
  1: {
    name: 'serious', // the name of the function
    fn: console.warn // the function itself
    prefix: '[CAREFUL]'
  }
}
const logger = createLogger(1, levels)
logger.serious('WOOOO IT IS SERIOUS!'); // [CAREFUL] WOOOO IT IS SERIOUS! [with warning style on the console]

```

### `createLogger(defaultLevel, settings)`

| Parameter | Type | Description |
| ----------|------|-------------|
| `defaultLevel` | `Number` | The level of logging that your logger will have once created |
| `settings` | `Object` | An object that will contain the configuration of you log functions |

### The configuration object

Settings object must have numbers as keys of strings that, once coerced, will become the number. Remember that it's better you have simple numbers in order to have everything in order.

By the default the loggers gives three functions: `.critical`, `.warning` and `.info` with some prefix. You are free to override them.
Let's see what's inside the settings object.

| Parameter | Type | Description |
| ----------|------|-------------|
| `name` | `String` | The name of your function |
| `fn` | `Function` | The function that will be execture once you will call .name | 
| `prefix` | `String` | A string that will be preprended to your log |
| `pure` | `Boolean` | When it's `false`, your function will have to return a new function. Useful to integrate with third party libraries, such as `debug` |

```js
// Integration with debug
import { createLogger } from 'easy-log'
import debug from 'debug'
const levels = {
  1: {
    name: 'serious', // the name of the function
    fn: console.warn // the function itself
    prefix: '[CAREFUL]'
  },
  2: {
    name: 'debug',
    fn: function (label) {
      return debug(label)
    },
    pure: false
  }
}
const logger = createLogger(2, levels)
localStorage.debug = 'dummy:*'
const log = logger.debug('dummy:');
log('ehy')
log('ehy')
log('ehy')
```