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
      if (info.pure === false) {
        const res = info.fn()
        if (typeof res !== 'function') {
          throw new Error('You function for your level ' + info.name  + ' is not returning a new function')
        }
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
 * @param {Object} settings A number of settings to initialise your logger
 */
export function createLogger (defaultLevel, settings) {
  if (process.env.NODE_ENV !== 'production') {
    if (settings) {
      validateSettings(settings)
    }
  }
  return new Logger(defaultLevel, settings || DEFAULT_LEVELS);
}


