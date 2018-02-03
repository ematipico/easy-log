/* eslint-disable no-console */

import { Logger } from './logger'

const DEFAULT_LEVELS = {
  1: {
    name: 'critical',
    fn: console.error,
    prefix: '[CRITICAL]'
  },
  2: {
    name: 'warning',
    fn: console.warn,
    prefix: '[WARNING]'
  },
  3: {
    name: 'info',
    fn: console.log,
    prefix: '[INFO]'
  }
}


function validateSettings (settings) {
  const levelKeys = Object.keys(settings)
  levelKeys.forEach(levelKey => {
    if (isNaN(Number(levelKey))) {
      throw new Error('Levels must be numbers')
    }

    const info = settings[levelKey]
    if (typeof info.name !== 'string') {
      throw new Error('The name must be a string and it is mandatory')
    }
    if (typeof info.fn !== 'function') {
      throw new Error('The fn must be a function and it is mandatory')
    }

    if (typeof info.pure !== 'undefined') {
      if (typeof info.pure !== 'boolean') {
        throw new Error('The pure parameter for ' + info.name + ' must be a boolean')        
      }
    }
    if (typeof info.prefix !== 'undefined') {
      if (typeof info.prefix !== 'string') {
        throw new Error('The prefix for ' + info.name + ' must be a string')
      }
    }
  })


}

/**
 * It creates and returns a new instance of a logger
 * 
 * @param {Number} defaultLevel The default level of your loggin
 * @param {Object} settings A number of settings to initialise your logger
 * @param {String} settings.name The name of the function that will execture
 * @param {Function} settings.fn The function that will executed when you will call the '.name'
 * @param {String} settings.prefix A string that will be prepended to your log
 * @param {Boolean} settings.pure Optional. When your function has to return a new function. 
 * That's useful if you want integrate it with another library such as `debug`
 */
export function createLogger (defaultLevel, settings) {
  if (process.env.NODE_ENV !== 'production') {
    if (settings) {
      validateSettings(settings)
    }
  }
  return new Logger(defaultLevel, settings || DEFAULT_LEVELS);
}


