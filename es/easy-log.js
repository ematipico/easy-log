var DEFAULT_CURRENT_LEVEL = 2;
var NOOP = function NOOP() {};

function Logger(newCurrentLevel, levels) {
  this.currentLevel = newCurrentLevel || DEFAULT_CURRENT_LEVEL;
  this.levels = levels;
  installLevels(this);
}

Object.defineProperty(Logger.prototype, 'level', {
  set: function set(newLevel) {
    this.currentLevel = newLevel;
    installLevels(this);
  },
  get: function get() {
    return this.currentLevel;
  },
  configurable: true,
  enumerable: true
});

function installLevels(loggerInstance) {
  var currentLevel = loggerInstance.currentLevel;
  var levels = loggerInstance.levels;

  var levelNumbers = Object.keys(levels);
  levelNumbers.forEach(function (level) {
    var logLevelInformation = levels[level];
    var valueForPrototype = NOOP;
    // installing the functions 
    if (level <= currentLevel) {
      valueForPrototype = function valueForPrototype() {
        if (logLevelInformation.pure === false) {
          var closuredFunc = logLevelInformation.fn.apply(logLevelInformation, arguments);
          return function () {
            closuredFunc.apply(closuredFunc, arguments);
          };
        } else {
          var myArguments = Array.prototype.slice.call(arguments);
          if (logLevelInformation.prefix) {
            myArguments = Array.prototype.concat([], logLevelInformation.prefix, myArguments);
          }
          logLevelInformation.fn.apply(logLevelInformation, myArguments);
        }
      };
    }

    Object.defineProperty(Logger.prototype, logLevelInformation.name, {
      enumerable: true,
      configurable: true,
      value: valueForPrototype
    });
  });
}

/* eslint-disable no-console */

var DEFAULT_LEVELS = {
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
};

function validateSettings(settings) {
  var levelKeys = Object.keys(settings);
  levelKeys.forEach(function (levelKey) {
    if (isNaN(Number(levelKey))) {
      throw new Error('Levels must be numbers');
    }

    var info = settings[levelKey];
    if (typeof info.name !== 'string') {
      throw new Error('The name must be a string and it is mandatory');
    }
    if (typeof info.fn !== 'function') {
      throw new Error('The fn must be a function and it is mandatory');
    }

    if (typeof info.pure !== 'undefined') {
      if (typeof info.pure !== 'boolean') {
        throw new Error('The pure parameter for ' + info.name + ' must be a boolean');
      }
      if (info.pure === false) {
        var res = info.fn();
        if (typeof res !== 'function') {
          throw new Error('You function for your level ' + info.name + ' is not returning a new function');
        }
      }
    }
    if (typeof info.prefix !== 'undefined') {
      if (typeof info.prefix !== 'string') {
        throw new Error('The prefix for ' + info.name + ' must be a string');
      }
    }
  });
}

/**
 * It creates and returns a new instance of a logger
 * @param {Object} settings A number of settings to initialise your logger
 */
function createLogger(defaultLevel, settings) {
  if (process.env.NODE_ENV !== 'production') {
    if (settings) {
      validateSettings(settings);
    }
  }
  return new Logger(defaultLevel, settings || DEFAULT_LEVELS);
}

export { createLogger };
