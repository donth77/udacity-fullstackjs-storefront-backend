import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { CreateUser, User } from '../../models/user';
import { Product } from '../../models/product';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Products Endpoints', () => {
  const testUser: CreateUser = {
    firstname: 'Kurt',
    lastname: 'Schoenfeld',
    username: 'kschoenfeld',
    password: 'password123',
  };

  const testProduct: Product = {
    name: 'New Product',
    price: 99.99,
    category: 'Category',
  };

  let token = '';
  let testUserId = 0;
  let testProductId = 0;

  beforeAll(async () => {
    const res = await request.post('/users').send(testUser);

    token = res.text;
    const { user: createdUser } = jwt.verify(token, SECRET) as { user: User };
    testUserId = createdUser.id;
  });

  afterAll(async () => {
    await request
      .delete(`/users/${testUserId}`)
      .set('Authorization', `bearer ${token}`);
  });

  it('should create product', async () => {
    const res = await request
      .post('/products')
      .send(testProduct)
      .set('Authorization', `bearer ${token}`);

    const { id, name, price, category } = res.body;
    testProductId = id;
    expect(res.status).toBe(200);
    expect(name).toEqual(testProduct.name);
    expect(price).toEqual(testProduct.price);
    expect(category).toEqual(testProduct.category);
  });

  it('should get all products', async () => {
    const res = await request.get('/products');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get created product', async () => {
    const res = await request
      .get(`/products/${testProductId}`)
      .set('Authorization', `bearer ${token}`);

    const { id, name, price, category } = res.body;
    expect(res.status).toBe(200);
    expect(id).toEqual(testProductId);
    expect(name).toEqual(testProduct.name);
    expect(price).toEqual(testProduct.price);
    expect(category).toEqual(testProduct.category);
  });
});
