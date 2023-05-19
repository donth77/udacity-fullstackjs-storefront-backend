import Client from '../database';

export interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
}

export class ProductStore {
  async index(category?: string): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      let sql = 'SELECT * FROM products';
      if (category) {
        sql += ' WHERE category=($1)';
      }
      const { rows } = await conn.query(sql, category ? [category] : undefined);
      return rows;
    } catch (err) {
      throw new Error(`Failed to get products. ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Failed to find product ${id}. ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    const { name, price, category } = product;
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [name, price, category]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Failed to add new product ${name}. ${err}`);
    }
  }

  async update(id: number, productData: Product): Promise<Product> {
    const { name, price, category } = productData;

    try {
      const sql =
        'UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [name, price, category, id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Failed to update product ${name}. ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Failed to delete product ${id}. ${err}`);
    }
  }
}
