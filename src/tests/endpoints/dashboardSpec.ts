import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import app from '../../server';
import { CreateUser, User } from '../../models/user';
import { Product } from '../../models/product';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Dashboard Endpoints', () => {
  const testUser: CreateUser = {
    firstname: 'Karen',
    lastname: 'Schoenfeld',
    username: 'karenschoenfeld',
    password: 'password123',
  };

  const testProducts: Product[] = [
    {
      name: 'Product 1',
      price: 79.99,
      category: 'Category 1',
    },
    {
      name: 'Product 2',
      price: 35.49,
      category: 'Category 1',
    },
    {
      name: 'Product 3',
      price: 119.79,
      category: 'Category 2',
    },
    {
      name: 'Product 4',
      price: 29.99,
      category: 'Category 2',
    },
    {
      name: 'Product 5',
      price: 70,
      category: 'Category 3',
    },
    {
      name: 'Product 6',
      price: 70,
      category: 'Category 3',
    },
  ];

  const testOrder = {
    status: 'test',
    userId: 0,
  };

  let token = '';
  const testProductIds: number[] = [];
  let testOrderId = 0;

  beforeAll(async () => {
    const res = await request.post('/users').send(testUser);

    token = res.text;
    const { user: createdUser } = jwt.verify(token, SECRET) as { user: User };
    testOrder.userId = createdUser.id;

    for (let i = 0; i < testProducts.length; i++) {
      const res = await request
        .post('/products')
        .send(testProducts[i])
        .set('Authorization', `bearer ${token}`);
      testProductIds.push(Number(res.body.id));
    }

    const res2 = await request
      .post('/orders')
      .send(testOrder)
      .set('Authorization', `bearer ${token}`);

    testOrderId = res2.body.id;

    await request
      .post(`/orders/${testOrderId}/products`)
      .send({
        productId: testProductIds[0],
        quantity: 1,
      })
      .set('Authorization', `bearer ${token}`);
  });

  it('should get 5 most popular products', async () => {
    const res = await request.get('/five-most-popular');
    const product = res.body[0];
    const testProduct = testProducts[0];

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(product.name).toEqual(testProduct.name);
    expect(product.price).toEqual(testProduct.price);
    expect(product.total_quantity).toEqual(1);
  });

  it('should get 5 most expensive products', async () => {
    const res = await request.get('/five-most-expensive');
    const products = res.body;

    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(5);
    expect(products[0].name).toEqual(testProducts[2].name);
    expect(products[1].name).toEqual(testProducts[0].name);
    expect(products[2].name).toEqual(testProducts[4].name);
    expect(products[3].name).toEqual(testProducts[5].name);
    expect(products[4].name).toEqual(testProducts[1].name);
  });

  it('should get products by category', async () => {
    const res = await request
      .get('/products?category=Category 2')
      .set('Authorization', `bearer ${token}`);

    const products = res.body;
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(2);
    expect(products[0].category).toEqual('Category 2');
    expect(products[1].category).toEqual('Category 2');
  });
});
