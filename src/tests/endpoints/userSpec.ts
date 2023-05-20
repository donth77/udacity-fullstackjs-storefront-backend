import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { CreateUser, User } from '../../models/user';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Users Endpoints', () => {
  const testUser: CreateUser = {
    firstname: 'Kurt',
    lastname: 'Schoenfeld',
    username: 'kschoenfeld',
    password: 'password123',
  };

  let token = '';
  let testUserId = 0;

  it('should successfully create a user', async () => {
    const res = await request.post('/users').send(testUser);
    token = res.text;

    const { user: createdUser } = jwt.verify(token, SECRET) as { user: User };
    testUserId = createdUser.id;

    expect(res.status).toBe(200);
  });

  it('should get all users', async () => {
    const res = await request
      .get('/users')
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get the created user', async () => {
    const res = await request
      .get(`/users/${testUserId}`)
      .set('Authorization', `bearer ${token}`);

    const { id, firstname, lastname, username } = res.body;
    expect(res.status).toBe(200);
    expect(id).toEqual(testUserId);
    expect(firstname).toEqual(testUser.firstname);
    expect(lastname).toEqual(testUser.lastname);
    expect(username).toEqual(testUser.username);
  });

  it('should update user', async () => {
    const res = await request
      .put(`/users/${testUserId}`)
      .send({
        firstname: 'Kurt',
        lastname: 'Schoenfald',
      })
      .set('Authorization', `bearer ${token}`);

    const { id, firstname, lastname, username } = res.body;
    expect(res.status).toBe(200);
    expect(id).toEqual(testUserId);
    expect(firstname).toEqual('Kurt');
    expect(lastname).toEqual('Schoenfald');
    expect(username).toEqual(testUser.username);
  });

  it('should successfully authenticate user', async () => {
    const res = await request.post('/users/authenticate').send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
  });

  it('should delete user', async () => {
    const res = await request
      .delete(`/users/${testUserId}`)
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should reject invalid create request', async () => {
    const res = await request.post('/users').send({
      firstname: testUser.firstname,
      lastname: testUser.lastname,
      username: testUser.username,
    });

    expect(res.status).toBe(400);
  });
});
