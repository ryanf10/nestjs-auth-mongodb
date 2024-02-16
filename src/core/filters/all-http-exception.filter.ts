import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import get from 'lodash.get';
import { logger } from '../../main';
import process from 'process';

@Catch()
export class AllHttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        messages: [
          {
            name: get(exception.getResponse(), 'message'),
            errors: [get(exception.getResponse(), 'message')],
          },
        ],
      });
    } else if (exception.name === 'ValidationError') {
      // handle mongodb validation
      const errors = get(exception, 'errors');
      const messages = [];
      Object.keys(errors).forEach((key) => {
        const error = get(errors, key);
        if (error) {
          messages.push({
            name: key,
            errors: [get(error, 'message')],
          });
        }
      });
      response.status(422).json({
        statusCode: 422,
        timestamp: new Date().toISOString(),
        path: request.url,
        messages: messages,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        messages: [
          {
            name: 'Internal Server Error',
            errors:
              process.env.NODE_ENV == 'production'
                ? ['Internal Server Error']
                : [exception.message],
          },
        ],
      });
      // log internal server error
      logger.error(
        exception.message,
        exception.stack,
        exception.constructor.name,
      );
    }
  }
}
