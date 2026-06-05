import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import logger from '../config/logger';

const morganFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

export const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(`[${req.method}] ${req.path}`);
  next();
};