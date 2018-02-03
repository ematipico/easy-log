const DEFAULT_CURRENT_LEVEL = 3;
const NOOP = function () {}

export function Logger (newCurrentLevel, levels) {
  this.currentLevel = newCurrentLevel || DEFAULT_CURRENT_LEVEL
  this.levels = levels
  installLevels(this)
}

Object.defineProperty(Logger.prototype, 'level', {
  set: function (newLevel) {
    this.currentLevel = newLevel
    installLevels(this)
  },
  get: function () {
    return this.currentLevel
  },
  configurable: true,
  enumerable: true
})

function installLevels (loggerInstance) {
    const currentLevel = loggerInstance.currentLevel
    const levels = loggerInstance.levels

    const levelNumbers = Object.keys(levels)
    levelNumbers.forEach(level => {
      const logLevelInformation = levels[level]
      let valueForPrototype = NOOP;
      // installing the functions 
      if (level <= currentLevel) {
        valueForPrototype = function () {
          if (logLevelInformation.pure === false) {
            const closuredFunc = logLevelInformation.fn.apply(logLevelInformation, arguments);
            return function () {
                closuredFunc.apply(closuredFunc, arguments)
            }
          } else {
            let myArguments = Array.prototype.slice.call(arguments)
            if (logLevelInformation.prefix) {
              myArguments = Array.prototype.concat([], logLevelInformation.prefix, myArguments)
            }
            logLevelInformation.fn.apply(logLevelInformation, myArguments)            
          }
        }
      }

      Object.defineProperty(Logger.prototype, logLevelInformation.name, {
        enumerable: true,
        configurable: true,
        value: valueForPrototype
      })
    })
}