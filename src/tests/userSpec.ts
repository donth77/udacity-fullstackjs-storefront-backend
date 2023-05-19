import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../server';
import { CreateUser } from '../models/user';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('User Handler', () => {
  const createUser: CreateUser = {
    firstName: 'Kurt',
    lastName: 'Schoenfeld',
    username: 'kschoenfeld',
    password: 'password123',
  };

  let token: string,
    userId = 1;

  it('should get the create endpoint', async () => {
    const res = await request.post('/users').send(createUser);
    // const res = await request.get('/');
    const { body, status } = res;
    token = body;

    // jwt.verify(token, SECRET);
    console.log(body);

    expect(status).toBe(200);
    // done();
  });
});
