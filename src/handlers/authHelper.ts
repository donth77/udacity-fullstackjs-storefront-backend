import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { sendErrorResp } from './errorHelper';
dotenv.config();

const SECRET = process.env.TOKEN_SECRET as Secret;

export function signAndGetUserToken(user: User) {
  return jwt.sign({ user }, SECRET);
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    sendErrorResp(res, 401, 'Invalid token');
    return false;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET);
    next();
  } catch (err) {
    sendErrorResp(res, 401, 'Invalid token');
    return;
  }
}
