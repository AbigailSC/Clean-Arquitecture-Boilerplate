import path from 'path';
import { createLogger, format, transports, addColors } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import morgan, { StreamOptions } from 'morgan';

const stream: StreamOptions = {
  write: (message) => logger.http(message),
};

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream,
  },
);

const customLevels = {
  levels: {
    error: 0, //* For logging errors that might need immediate attention.
    warn: 1, //* For logging warnings that indicate potential issues.
    info: 2, //* For logging informational messages that highlight the progress of the application.
    http: 3, //* For logging HTTP requests.
    verbose: 4, //* For logging detailed information useful during debugging.
    debug: 5, //* For logging debugging information.
    silly: 6, //* For logging the most detailed information, often more than needed.
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'green',
    verbose: 'magenta',
    debug: 'cyan',
    silly: 'white',
  },
};

addColors(customLevels.colors);

const consoleFormat = format.combine(
  format((info) => {
    info.splat = info[Symbol.for('splat')];
    info.level = info.level.toUpperCase();
    return info;
  })(),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.colorize({ all: true }),
  format.printf(({ timestamp, level, message, splat }) => {
    return `[${timestamp}] [${level}] ${message}`;
  }),
);

const fileFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  }),
  format.json({
    space: 2,
  }),
);

const logger = createLogger({
  levels: customLevels.levels,
  level: 'debug',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new DailyRotateFile({
      filename: 'logs-%DATE%.log',
      dirname: './logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    }),
    new DailyRotateFile({
      filename: 'errors-%DATE%.log',
      dirname: './logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: fileFormat,
    }),
  ],
});
export interface LoggerMethods {
  info: (message: string, metadata?: Record<string, unknown>) => void;
  error: (message: string, metadata?: Record<string, unknown>) => void;
  warn: (message: string, metadata?: Record<string, unknown>) => void;
  debug: (message: string, metadata?: Record<string, unknown>) => void;
}

const getCallerFile = () => {
  const err = new Error();
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = err.stack as unknown as NodeJS.CallSite[];
  Error.prepareStackTrace = undefined;

  const caller = stack.find((call) => {
    const fileName = call.getFileName();
    return fileName && !fileName.includes('logger.config');
  });

  if (!caller) return 'unknown';

  const fileName = caller.getFileName();
  return fileName ? path.basename(fileName) : 'unknown';
};

export const buildLogger = (): LoggerMethods => {
  const getService = () => getCallerFile();
  return {
    info: (message: string) => logger.info(message, getService()),
    error: (message: string) => logger.error(message, getService()),
    warn: (message: string) => logger.warn(message, getService()),
    debug: (message: string) => logger.debug(message, getService()),
  };
};
