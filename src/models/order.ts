import Client from '../database';

export interface Order {
  id?: number;
  status: string;
  user_id: string;
}

export interface OrderProduct {
  id?: number;
  quantity: number;
  order_id: string;
  product_id: string;
}

export interface OrderWithProducts extends Order {
  products: OrderProduct[];
}

export interface CreateOrder {
  status: string;
  userId: string;
}

export interface UpdateOrder {
  status: string;
}

export class OrderStore {
  async index(
    userId?: string,
    status?: string,
    withProducts?: boolean
  ): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      // Query orders table
      let sql = 'SELECT * FROM orders';
      let values: string[] = [];
      // Apply optional params
      if (userId && status) {
        sql += ' WHERE user_id=($1) AND status=($2)';
        values = [userId, status];
      } else if (userId) {
        sql += ' WHERE user_id=($1)';
        values = [userId];
      } else if (status) {
        sql += ' WHERE status=($1)';
        values = [status];
      }
      const { rows: orderRows } = await conn.query(sql, values);
      const resultNoProducts = orderRows;
      let resultWithProducts: OrderWithProducts[] = [];

      if (withProducts) {
        // Query order_products table for each order
        const orderProductSql =
          'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';

        resultWithProducts = [];
        for (const order of orderRows) {
          const { rows: orderProductRows } = await conn.query(orderProductSql, [
            order.id,
          ]);
          resultWithProducts.push({
            ...order,
            products: orderProductRows,
          });
        }
      }

      conn.release();
      return withProducts ? resultWithProducts : resultNoProducts;
    } catch (err) {
      throw new Error(`Failed to get orders. ${err}`);
    }
  }

  async show(id: number, withProducts?: boolean): Promise<Order> {
    try {
      // Query orders table
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const { rows: orderRows } = await conn.query(sql, [id]);

      let resultWithProducts: OrderWithProducts | undefined;

      // Query order_products table for the order
      if (withProducts) {
        const order = orderRows[0];
        const orderProductSql =
          'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
        const { rows: orderProductRows } = await conn.query(orderProductSql, [
          order.id,
        ]);
        resultWithProducts = {
          ...order,
          products: orderProductRows,
        };
      }

      conn.release();
      return withProducts ? resultWithProducts : orderRows[0];
    } catch (err) {
      throw new Error(`Failed to find order ${id}. ${err}`);
    }
  }

  async showWithProducts(id: number): Promise<OrderWithProducts> {
    try {
      // Query orders table
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const { rows: orderRows } = await conn.query(sql, [id]);
      const order = orderRows[0];

      // Query order_products table for the order
      const orderProductSql =
        'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
      const { rows: orderProductRows } = await conn.query(orderProductSql, [
        order.id,
      ]);
      const result: OrderWithProducts = {
        ...order,
        products: orderProductRows,
      };

      conn.release();
      return result;
    } catch (err) {
      throw new Error(`Failed to find order ${id}. ${err}`);
    }
  }

  async create(createOrder: CreateOrder): Promise<Order> {
    const { status, userId } = createOrder;
    try {
      // Insert into orders table
      const orderSql =
        'INSERT INTO orders (status, user_id, order_time) VALUES($1, $2, NOW()) RETURNING *';
      const conn = await Client.connect();
      const { rows: orderRows } = await conn.query(orderSql, [status, userId]);

      const createdOrder: Order = orderRows[0];
      conn.release();
      return createdOrder;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to create order. ${err}`);
    }
  }

  async update(id: number, updateOrder: UpdateOrder): Promise<Order> {
    const { status } = updateOrder;

    try {
      const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [status, id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Failed to update order ${id}`);
    }
  }

  async addProduct(
    quantity: number,
    orderId: number,
    productId: string
  ): Promise<OrderProduct> {
    // get order to see if it is open
    // try {
    //   const sql = "SELECT * FROM orders WHERE id=($1)";
    //   const conn = await Client.connect();
    //   const { rows } = await conn.query(sql, [orderId]);
    //   const order: Order = rows[0];
    //   if (order.status !== "open") {
    //     throw new Error(
    //       `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
    //     );
    //   }
    //   conn.release();
    // } catch (err) {
    //   throw new Error(`${err}`);
    // }

    try {
      const sql = `INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *`;
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [quantity, orderId, productId]);
      const order = rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(
        `Failed to add product ${productId} to order ${orderId}. ${err}`
      );
    }
  }
}
