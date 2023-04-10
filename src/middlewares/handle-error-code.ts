import { Request, NextFunction, Response } from 'express';
import { logger } from 'src/libs/logger';
import { ErrorCodeMap } from 'src/libs/errors';

export const errorHandler = ()=>
  // This is an express error handler, need to the 4 variable signature
  // eslint-disable-next-line
   (err: any, req: Request, res: Response, next: NextFunction) => {

    const statusCode = Number( ErrorCodeMap[ err.error_code ] );

    if( !Number.isNaN( statusCode ) ){

      const logContext = {
        error_code:  err.error_code,
        status_code: statusCode,
        context:     err.context
      };

      // _.defaults(logContext, req.safeLoggingRequestData); // to be determined what is this for

      logger.info( logContext, 'API error' );

      return res.status( statusCode ).send( {
        error_code: err.error_code,
        message:    err.message
      } );

    }

    return res.status( err.status || 500 ).json( {
      message: err.message,
      errors:  err.errors,
    } );

  }
;
