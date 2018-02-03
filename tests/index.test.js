import { createLogger } from 'index'

describe('createLogger', () => {
  it('returns a function', () => {
    const log = createLogger()

    expect(log).toBeDefined()
  })

  it('returns a logger that has a default level', () => {
    const l = createLogger()
    expect(l.level).toEqual(3)
  })

  it('throws if levels keys are not numbers', () => {
    const c = {
      'notNumber': {

      }
    }

    const badFun = () => {
      createLogger(1, c)
    }

    expect(badFun).toThrowErrorMatchingSnapshot()

  })

  it('throws if the name is not a string', () => {
    const c = {
      1: {
        name: 5,
        fn: () => {}
      }
    }

    const c1 = {
      1: {
        fn: () => {}
      }
    }

    expect(() => createLogger(1, c)).toThrowErrorMatchingSnapshot()
    expect(() => createLogger(1, c1)).toThrowErrorMatchingSnapshot()

  })

  it('throws if the fn is not set or is not a function', () => {
    const c = {
      1: {
        name: 5,
      }
    }

    const c1 = {
      1: {
        name: 'ehy',
        fn: 'something'
      }
    }

    expect(() => createLogger(1, c)).toThrowErrorMatchingSnapshot()
    expect(() => createLogger(1, c1)).toThrowErrorMatchingSnapshot()
  })

  it('throws if the pure parameter is not a boolean', () => {
    const c = {
      1: {
        name: 'test',
        fn: () => {},
        pure: 'wweee'
      }
    }

    expect(() => createLogger(1, c)).toThrowErrorMatchingSnapshot()
  })

  it('throws if prefix is not a string', () => {
    const c = {
      1: {
        name: 'test',
        fn: () => {},
        prefix: () => {}
      }
    }

    expect(() => createLogger(1, c)).toThrowErrorMatchingSnapshot()
  })

  it('returns a logger where you can set a new level', () => {
    const l = createLogger()
    l.level = 4
    expect(l.level).toEqual(4)
  })

  it('creates logger funcs for the default configuration', () => {
    const l = createLogger()
    expect(l.critical).toBeDefined()
    expect(l.warning).toBeDefined()
    expect(l.info).toBeDefined()
  })

  it('creates logger funcs for personalised configuration', () => {
    const customConfiguration = {
      1: {
        name: 'boo',
        fn: () => {}
      },
      2: {
        name: 'bar',
        fn: () => {}
      }
    }
    const l = createLogger(2, customConfiguration)
    expect(l.boo).toBeDefined()
    expect(l.bar).toBeDefined()
  })

  it('creates logger funcs for personalised configuration', () => {
    const customConfiguration = {
      1: {
        name: 'boo',
        fn: () => {}
      },
      2: {
        name: 'bar',
        fn: () => {}
      }
    }
    const l = createLogger(2, customConfiguration)
    expect(l.boo).toBeDefined()
    expect(l.bar).toBeDefined()
  })

  it('creates logger that uses the arguments passed', () => {
    const customConfiguration = {
      1: {
        name: 'boo',
        fn: function (first, second) {
          expect(first).toEqual('ehy')
          expect(second).toEqual('man')
        }
      },
      2: {
        name: 'bar',
        fn: function (first, second) {
          expect(first).toEqual('second')
          expect(second).toEqual('man')
        }
      }
    }
    const l = createLogger(2, customConfiguration)
    l.boo('ehy', 'man')
    l.bar('second', 'man')
  })

  it('it handles non-pure functions, that allow to return functions to use', () => {

    const nonPureFunc = function (label) {
      const myLabel = label + ' manipulated';
      return function (second) {
        expect(myLabel).toEqual('ehy manipulated')
        expect(second).toEqual('second')
        expect(label).toEqual('ehy')
      }
    }

    const customConfiguration = {
      1: {
        name: 'boo',
        fn: function (label) {
          return nonPureFunc(label)
        }, 
        pure: false
      }      
    }

    const l = createLogger(1, customConfiguration)
    const fn = l.boo('ehy')

    fn('second')
  })

  it('prepends the prefix when it is set', () => {
    const c = {
      1: {
        name: 'test',
        fn: function(prefix, first) {
          expect(prefix).toEqual('prefix')
          expect(first).toEqual('dummy')
        },
        prefix: 'prefix'
      }
    }

    const l = createLogger(1, c)
    l.test('dummy')
  })
});