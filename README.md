# Easy log
## Simple, combustible and pluggable logger for browser ##

With easy log, you can have your own logger and add all the functions that you want.
You can set log levels, fallbacks and so one. 

At the end the logger is just a function that modify itself based on your needs

### Installation ###
With `npm`
```bash
npm i --save @ematipico/easy-log
```
With `yarn`
```bash
yarn add @ematipico/easy-log
```

### Create a logger ###

```js
import { createLogger } from 'easy-log'

const AppLogger = createLogger()

AppLogger.error('There\'s an error here!')

// [ERROR] There's an error here!
```

### Settings ###

```js 

```
