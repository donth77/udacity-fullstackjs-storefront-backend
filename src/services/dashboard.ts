import Client from '../database';

export class DashboardQueries {
  // Get the top 5 most popular products based on total quantity in all orders
  async fiveMostPopular(): Promise<
    { name: string; price: number; total_quantity: number }[]
  > {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT products.name, products.price, CAST(SUM(order_products.quantity) AS INTEGER) AS total_quantity FROM products INNER JOIN order_products ON products.id = order_products.product_id GROUP BY products.id ORDER BY total_quantity DESC LIMIT 5;';
      const { rows } = await conn.query(sql);
      conn.release();
      return rows;
    } catch (err) {
      throw new Error(`Failed to get users with orders. ${err}`);
    }
  }

  // Get the 5 most expensive products
  async fiveMostExpensive(): Promise<{ name: string; price: number }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';
      const { rows } = await conn.query(sql);
      conn.release();
      return rows;
    } catch (err) {
      throw new Error(`Failed to get products by price. ${err}`);
    }
  }

  // Get all products that have been ordered
  async productsInOrders(): Promise<
    { name: string; price: number; order_id: string }[]
  > {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id';
      const { rows } = await conn.query(sql);
      conn.release();
      return rows;
    } catch (err) {
      throw new Error(`Failed to get products and orders. ${err}`);
    }
  }

  // Get all users that have made orders
  async usersWithOrders(): Promise<{ firstName: string; lastName: string }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT firstName, lastName FROM users INNER JOIN orders ON users.id = orders.user_id';
      const { rows } = await conn.query(sql);
      conn.release();
      return rows;
    } catch (err) {
      throw new Error(`Failed to get users with orders. ${err}`);
    }
  }
}
