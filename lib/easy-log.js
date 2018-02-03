'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var DEFAULT_CURRENT_LEVEL = 3;
var NOOP = function NOOP() {};

function Logger(newCurrentLevel, levels) {
  this.currentLevel = newCurrentLevel || DEFAULT_CURRENT_LEVEL;
  this.levels = levels;
  installLevels(this);
}

Object.defineProperty(Logger.prototype, 'level', {
  set: function set$$1(newLevel) {
    this.currentLevel = newLevel;
    installLevels(this);
  },
  get: function get$$1() {
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
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (logLevelInformation.pure === false) {
          var closuredFunc = logLevelInformation.fn.apply(logLevelInformation, args);
          return function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            closuredFunc.apply(closuredFunc, args);
          };
        } else {
          var myArguments = [].concat(toConsumableArray(args));
          if (logLevelInformation.prefix) {
            myArguments = [logLevelInformation.prefix].concat(toConsumableArray(args));
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
 * @param {Number} defaultLevel The default level of your loggin
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

exports.createLogger = createLogger;
