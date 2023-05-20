import { Application, Request, Response } from 'express';
import { verifyJWT, signAndGetUserToken } from './authHelper';
import { User, UserStore } from '../models/user';
import {
  handleCrudError,
  checkIdParam,
  checkMissingBodyParams,
  sendErrorResp,
} from './errorHelper';
import { InfoResp } from './types';

export default function userRoutes(app: Application) {
  app.get('/users', verifyJWT, index); // auth token required
  app.get('/users/:id', checkIdParam, verifyJWT, show); // auth token required
  app.post(
    '/users',
    checkMissingBodyParams(['firstname', 'lastname', 'username', 'password']),
    create
  );
  app.put(
    '/users/:id',
    checkMissingBodyParams(['firstname', 'lastname']),
    checkIdParam,
    verifyJWT,
    update
  ); // auth token required
  app.delete('/users/:id', checkIdParam, verifyJWT, deleteUser); // auth token required
  app.post(
    '/users/authenticate',
    checkMissingBodyParams(['username', 'password']),
    authenticate
  );
}

const userStore = new UserStore();

const index = async (_: Request, res: Response) => {
  try {
    const users: User[] = await userStore.index();
    res.json(users);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user: User = await userStore.show(id);
    if (!user) {
      return sendErrorResp(res, 400, `User not found for id ${id}`);
    }
    res.json(user);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, username, password } = req.body;
    const newUser: User = await userStore.create({
      firstname,
      lastname,
      username,
      password,
    });
    const signedToken = signAndGetUserToken(newUser);
    res.send(signedToken);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { firstname, lastname } = req.body;
    const updateUser: User = await userStore.update(id, {
      firstname,
      lastname,
    });
    if (!updateUser) {
      return sendErrorResp(res, 400, `User not found for id ${id}`);
    }
    res.json(updateUser);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await userStore.delete(id);
    const code = 200;
    const infoResp: InfoResp = {
      code,
      msg: `Successfully deleted user with id ${id}`,
    };
    res.status(code).json(infoResp);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user: User | null = await userStore.authenticate(username, password);
    if (!user) {
      return sendErrorResp(res, 401, `Incorrect password for user ${username}`);
    }
    res.send(signAndGetUserToken(user));
  } catch (err) {
    res.status(400).json(err);
  }
};
