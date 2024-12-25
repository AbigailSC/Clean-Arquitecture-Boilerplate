import path from 'path';
import { createLogger, format, transports, addColors } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import morgan, { StreamOptions } from 'morgan';

const getCallerInfo = () => {
  const err = new Error();
  const stack = err.stack?.split('\n')[3] || ''; // Toma el tercer nivel del stack trace
  const match = stack.match(/\((.*):(\d+):(\d+)\)/); // Extrae archivo, línea y columna
  if (match) {
    const [_, filePath, line, col] = match;
    return {
      file: path.basename(filePath),
      line: parseInt(line, 10),
      column: parseInt(col, 10),
    };
  }
  return {};
};

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
    info.level = info.level.toUpperCase();
    return info;
  })(),
  format.colorize(),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format((info) => {
    info.caller = getCallerInfo();
    return info;
  })(),
  format.printf(({ timestamp, level, message, service, ...rest }) => {
    const meta = Object.keys(rest).length > 0 ? JSON.stringify(rest, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${service ? `[Service: ${service}]` : ''} ${meta}`;
  }),
);

const fileFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  }),
  format.metadata({ fillExcept: ['timestamp', 'level', 'message'] }),
  format.json({
    space: 2,
  }),
);

const logger = createLogger({
  levels: customLevels.levels,
  level: 'debug',
  defaultMeta: { service: 'Clean Arquitecture Boilerplate', extend: getCallerInfo() },
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

export default logger;
