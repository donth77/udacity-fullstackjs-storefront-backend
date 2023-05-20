import { Application, Request, Response } from 'express';
import { handleCrudError } from './errorHelper';
import { DashboardQueries } from '../services/dashboard';

export default function dashboardRoutes(app: Application) {
  app.get('/five-most-popular', fiveMostPopular);
  app.get('/five-most-expensive', fiveMostExpensive);

  // No auth token required for these, but in a real system only admin would be authorized
}

const dashboard = new DashboardQueries();

const fiveMostPopular = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.fiveMostPopular();
    res.json(products);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};

const fiveMostExpensive = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.fiveMostExpensive();
    res.json(products);
  } catch (err) {
    handleCrudError(res, err as Error);
  }
};
