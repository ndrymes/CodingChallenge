import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ErrorCodes } from 'src/libs/errors';
import { JWT_TOKEN_SECRET } from 'src/configs/app';
import constants from 'src/constants'
const { ROLES: { SELLER }} = constants

export const handleTokenAuthorization = ( allowedRole?: string) => {
    return async (req: Request&{user:string}, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const token = req.headers['authorization'].replace('Bearer ', '');
            const decoded: any = await jwt.verify(token, JWT_TOKEN_SECRET);

            if (!decoded) {
                res.status(401).json({
                    error_code: ErrorCodes.UNAUTHORIZED_REQUEST,
                    message: 'Could not authorize request'
                });
            }    
            
            if ( allowedRole && decoded.role !== allowedRole) {
                res.status(401).json({
                    error_code: ErrorCodes.UNAUTHORIZED_REQUEST,
                    message: 'Could not authorize request'
                });
            } 

            res.locals.user = decoded
            return next();
        } catch (e) {
            res.status(401).json({
                error_code: ErrorCodes.UNAUTHORIZED_REQUEST,
                message: 'Could not authorize request'
            });
        }
    };
};