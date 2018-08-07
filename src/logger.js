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
      const isPure = typeof logLevelInformation.pure === 'boolean' ? logLevelInformation.pure === true : true
      let valueForPrototype = isPure ? NOOP : () => NOOP;
      // installing the functions 
      if (level <= currentLevel) {
        valueForPrototype = function () {
          let args = Array.prototype.slice.call(arguments)
          if (isPure === false) {
            const closuredFunc = logLevelInformation.fn.apply(logLevelInformation, args);
            return function () {
                let args = Array.prototype.slice.call(arguments)
                if (typeof logLevelInformation.prefix !== 'undefined') {
                  args = Array.prototype.concat([], [logLevelInformation.prefix], args)
                }

                closuredFunc.apply(closuredFunc, args)
            }
          } else {
            if (typeof logLevelInformation.prefix !== 'undefined') {
              const newArgs =  Array.prototype.concat([], [logLevelInformation.prefix], args)
              logLevelInformation.fn.apply(logLevelInformation, newArgs)            

            } else {
              logLevelInformation.fn.apply(logLevelInformation, args)            

            }
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