import { NextFunction, Request, Response } from 'express';
import { containSameElements, isStrValidNumber } from '../utils';
import { InfoResp } from './types';

type ErrorResp = InfoResp;

export function sendErrorResp(res: Response, code: number, msg: string) {
  const errorResp: ErrorResp = {
    code,
    msg,
  };
  return res.status(code).json(errorResp);
}

export function handleError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof SyntaxError) {
    console.error(err);
    return sendErrorResp(
      res,
      400,
      `Invalid JSON in request body: ${err.message}`
    );
  } else if (err) {
    console.error(err);
    return sendErrorResp(
      res,
      500,
      `Server encountered an unexpected error: ${err.message}`
    );
  }
  next();
}

export function handleCrudError(res: Response, err: Error) {
  console.error(err);
  sendErrorResp(res, 500, `${err.message}`);
}

export function checkMissingBodyParams(paramKeys: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const bodyKeys = Object.keys(req.body);
    if (!containSameElements(paramKeys, bodyKeys)) {
      const missingParams = paramKeys.filter((p) => !bodyKeys.includes(p));
      const lastParam = missingParams.pop();

      const missingParamsStr = missingParams.length
        ? `${missingParams.join(', ')} and ${lastParam}`
        : lastParam;

      const msg = `Missing required body parameters: ${missingParamsStr}`;
      return sendErrorResp(res, 400, msg);
    }
    next();
  };
}

export function checkIdParam(req: Request, res: Response, next: NextFunction) {
  if (!isStrValidNumber(req.params.id)) {
    return sendErrorResp(res, 400, `Missing required parameters: id`);
  }
  next();
}
