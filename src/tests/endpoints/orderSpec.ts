import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { CreateUser, User } from '../../models/user';
import { Product } from '../../models/product';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Orders Endpoints', () => {
  const testUser: CreateUser = {
    firstname: 'Kate',
    lastname: 'Schoenfeld',
    username: 'kateschoenfeld',
    password: 'password123',
  };

  const testProducts: Product[] = [
    {
      name: 'Product 1',
      price: 89.99,
      category: 'Category 1',
    },
  ];

  const testOrder = {
    status: 'active',
    userId: 0,
  };

  let token = '';
  let testUserId = 0;
  const testProductIds: number[] = [];
  let testOrderId = 0;

  beforeAll(async () => {
    const res = await request.post('/users').send(testUser);

    token = res.text;
    const { user: createdUser } = jwt.verify(token, SECRET) as { user: User };
    testUserId = createdUser.id;
    testOrder.userId = createdUser.id;

    for (let i = 0; i < testProducts.length; i++) {
      const res = await request
        .post('/products')
        .send(testProducts[i])
        .set('Authorization', `bearer ${token}`);
      testProductIds.push(Number(res.body.id));
    }
  });

  it('should create order', async () => {
    const res = await request
      .post('/orders')
      .send(testOrder)
      .set('Authorization', `bearer ${token}`);

    const { id, status, user_id } = res.body;
    testOrderId = id;
    expect(res.status).toBe(200);
    expect(status).toEqual(testOrder.status);
    expect(Number(user_id)).toEqual(testOrder.userId);
  });

  it('should get all orders', async () => {
    const res = await request
      .get('/orders')
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get created order', async () => {
    const res = await request
      .get(`/orders/${testOrderId}`)
      .set('Authorization', `bearer ${token}`);

    const { id, status, user_id } = res.body;
    expect(res.status).toBe(200);
    expect(id).toEqual(testOrderId);
    expect(status).toEqual(testOrder.status);
    expect(Number(user_id)).toEqual(testOrder.userId);
  });

  it('should add product to order', async () => {
    const res = await request
      .post(`/orders/${testOrderId}/products`)
      .send({
        productId: testProductIds[0],
        quantity: 1,
      })
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should get order with products', async () => {
    const res = await request
      .get(`/orders/${testOrderId}?withProducts=true`)
      .set('Authorization', `bearer ${token}`);

    const { id, user_id, products } = res.body;
    const product = products[0];

    expect(res.status).toBe(200);
    expect(products.length).toBeGreaterThan(0);
    expect(Number(product.product_id)).toEqual(testProductIds[0]);
    expect(Number(user_id)).toEqual(testUserId);
    expect(Number(id)).toEqual(testOrderId);
  });

  it('should get current orders for user', async () => {
    const res = await request
      .get(`/orders?userid=${testUserId}&status=active`)
      .set('Authorization', `bearer ${token}`);

    const { id, user_id, status } = res.body[0];
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(status).toEqual('active');
    expect(Number(user_id)).toEqual(testUserId);
    expect(Number(id)).toEqual(testOrderId);
  });

  it('should update order status', async () => {
    const res = await request
      .put(`/orders/${testOrderId}`)
      .send({
        status: 'complete',
      })
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should get completed orders for user', async () => {
    const res = await request
      .get(`/orders?userid=${testUserId}&status=complete`)
      .set('Authorization', `bearer ${token}`);

    const { id, user_id, status } = res.body[0];
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(status).toEqual('complete');
    expect(Number(user_id)).toEqual(testUserId);
    expect(Number(id)).toEqual(testOrderId);
  });
});
