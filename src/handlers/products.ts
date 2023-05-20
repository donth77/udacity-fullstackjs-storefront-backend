import { Application, Request, Response } from 'express';
import { verifyJWT } from './authHelper';
import {
  handleCrudError,
  checkIdParam,
  checkMissingBodyParams,
  sendErrorResp,
} from './errorHelper';
import { Product, ProductStore } from '../models/product';
import { isStrValidNumber } from '../utils';
import { InfoResp } from './types';

export default function productRoutes(app: Application) {
  app.get('/products', index);
  app.get('/products/:id', checkIdParam, show);
  app.post(
    '/products',
    checkMissingBodyParams(['name', 'price', 'category']),
    verifyJWT,
    create
  ); // auth token required
  app.delete('/products/:id', checkIdParam, verifyJWT, deleteProduct); // auth token required
}

const productStore = new ProductStore();

const index = async (req: Request, res: Response) => {
  const category = req.query.category;
  try {
    const products: Product[] = await productStore.index(category?.toString());
    res.json(products);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product: Product = await productStore.show(id);
    if (!product) {
      return sendErrorResp(res, 400, `Product not found for id ${id}`);
    }
    res.json(product);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { name, price, category } = req.body;
    if (!isStrValidNumber(price)) {
      return sendErrorResp(res, 400, `price is not a valid number`);
    }
    const newProduct: Product = await productStore.create({
      name,
      price,
      category,
    });
    res.json(newProduct);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await productStore.delete(id);
    const code = 200;
    const infoResp: InfoResp = {
      code,
      msg: `Successfully deleted product with id ${id}`,
    };
    res.status(code).json(infoResp);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};
