import { CreateOrder, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { CreateUser, UserStore } from '../../models/user';

const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  const testUser: CreateUser = {
    firstname: 'Kim',
    lastname: 'Schoenfeld',
    username: 'kimschoenfeld',
    password: 'password123',
  };

  const testProduct: Product = {
    name: 'Another New Product Again',
    price: 299.99,
    category: 'Category',
  };
  let testProductId = 0;

  const testOrder: CreateOrder = {
    status: 'active',
    userId: '0',
  };
  let testOrderId = 0;

  beforeAll(async () => {
    const createdUser = await userStore.create(testUser);
    testOrder.userId = createdUser.id.toString();

    const createdProduct = await productStore.create(testProduct);
    testProductId = Number(createdProduct.id);
  });

  it('should create order', async () => {
    const createdOrder = await orderStore.create(testOrder);
    testOrderId = Number(createdOrder.id);
    expect(createdOrder.status).toBe(testOrder.status);
    expect(createdOrder.user_id).toBe(testOrder.userId);
  });

  it('should get all orders', async () => {
    const orders = await orderStore.index();
    expect(orders.length).toBeGreaterThan(0);
  });

  it('should get order', async () => {
    const order = await orderStore.show(testOrderId);
    expect(Number(order.id)).toBe(testOrderId);
    expect(order.status).toBe(testOrder.status);
    expect(order.user_id).toBe(testOrder.userId);
  });

  it('should add product', async () => {
    const orderProduct = await orderStore.addProduct(
      1,
      testOrderId,
      testProductId.toString()
    );
    expect(orderProduct.quantity).toBe(1);
    expect(orderProduct.order_id).toBe(testOrderId.toString());
    expect(orderProduct.product_id).toBe(testProductId.toString());
  });

  it('should update order', async () => {
    const order = await orderStore.update(testOrderId, {
      status: 'complete',
    });
    expect(Number(order.id)).toBe(testOrderId);
    expect(order.status).toBe('complete');
    expect(order.user_id).toBe(testOrder.userId);
  });
});
