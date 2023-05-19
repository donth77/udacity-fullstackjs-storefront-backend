import express, { Application, Request, Response } from 'express';

import userRoutes from './handlers/users';
import { handleError } from './handlers/errorHelper';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import dashboardRoutes from './handlers/dashboard';

const app: Application = express();
const port = process.env.ENV === 'test' ? 3001 : 3000;
const address = `127.0.0.1:${port}`;

app.use(express.json());
app.use(handleError);
app.get('/', function (req: Request, res: Response) {
  res.send('Storefront Backend API is running');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);
dashboardRoutes(app);

app.listen(port, () => {
  console.info(`Starting app on: ${address}`);
});

export default app;
