import { createLogger } from 'easy-log'
import debug from 'debug'

const levels = {
  1: {
    name: 'debug',
    fn: function(label) {
      return debug(label)
    },
    pure: false
  }
}

const TestLogger = createLogger(3);

TestLogger.critical('Critical Error');
TestLogger.warning('Warning log');
TestLogger.info('Info Log');

const LoggerWithDebug = createLogger(1, levels)

const log = LoggerWithDebug.debug('label:with:columns')

log('foo')
log('bar')
log('Hello world!')