import { Application, Request, Response } from 'express';
import { verifyJWT } from './authHelper';
import {
  handleCrudError,
  checkIdParam,
  checkMissingBodyParams,
  sendErrorResp,
} from './errorHelper';
import { Order, OrderStore, UpdateOrder } from '../models/order';

export default function orderRoutes(app: Application) {
  app.get('/orders', verifyJWT, index); // auth token required
  app.get('/orders/:id', checkIdParam, verifyJWT, show); // auth token required
  app.post(
    '/orders',
    checkMissingBodyParams(['status', 'userId']),
    verifyJWT,
    create
  ); // auth token required
  app.put(
    '/orders/:id',
    checkMissingBodyParams(['status']),
    checkIdParam,
    verifyJWT,
    update
  ); // auth token required
  // add product
  app.post(
    '/orders/:id/products',
    checkIdParam,
    checkMissingBodyParams(['productId', 'quantity']),
    verifyJWT,
    addProduct
  ); // auth token required
}

const orderStore = new OrderStore();

const index = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const status = req.query.status;
  const withProductsBool = req.query.withProducts === 'true';

  try {
    const orders: Order[] = await orderStore.index(
      userId?.toString(),
      status?.toString(),
      withProductsBool
    );
    res.json(orders);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const show = async (req: Request, res: Response) => {
  const withProductsBool = req.query.withProducts === 'true';

  try {
    const id = Number(req.params.id);
    const order: Order = await orderStore.show(id, withProductsBool);

    if (!order) {
      return sendErrorResp(res, 400, `Order not found for id ${id}`);
    }
    res.json(order);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { status, userId } = req.body;
    const newOrder: Order = await orderStore.create({
      status,
      userId,
    });
    res.json(newOrder);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const updateOrder: UpdateOrder = await orderStore.update(id, {
      status,
    });
    if (!updateOrder) {
      return sendErrorResp(res, 400, `Order not found for id ${id}`);
    }
    res.json(updateOrder);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { productId } = req.body;
  const quantity = Number(req.body.quantity);

  try {
    const addedProduct = await orderStore.addProduct(
      quantity,
      orderId,
      productId
    );
    res.json(addedProduct);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};
