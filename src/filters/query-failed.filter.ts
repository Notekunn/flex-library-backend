import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply } from 'fastify';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

interface IConstraintErrors {
  readonly [constraintKey: string]: string;
}

export const ConstraintErrors: IConstraintErrors = {
  // TODO: replace to your unique key in the database
  UQ_97672ac88f789774dd47f7c8be3: 'error.unique.email',
};

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  constructor(public readonly reflector: Reflector) {}

  catch(exception: QueryFailedError & any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const errorMessage = ConstraintErrors[exception.constraint] || exception.message;

    const status =
      exception.constraint && exception.constraint.startsWith('UQ')
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).send({
      statusCode: status,
      error: STATUS_CODES[status],
      message: errorMessage,
    });
  }
}
