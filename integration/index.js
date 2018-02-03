import { createLogger } from 'easy-log'

const TestLogger = createLogger(3);

TestLogger.critical('Critical Error');
TestLogger.warning('Warning log');
TestLogger.info('Info Log');