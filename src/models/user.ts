import bcrypt from 'bcrypt';
import Client from '../database';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export type CreateUser = Omit<User, 'id'>;
export type UpdateUser = Omit<User, 'id' | 'username' | 'password'>;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const { rows } = await conn.query(sql);
      conn.release();
      return rows;
    } catch (err) {
      throw new Error(`Failed to get users. ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Failed to find user ${id}. ${err}`);
    }
  }

  async create(user: CreateUser): Promise<User> {
    const { firstName, lastName, username, password } = user;

    try {
      const sql =
        'INSERT INTO users (firstName, lastName, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(
        password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT_ROUNDS as string, 10)
      );
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [
        firstName,
        lastName,
        username,
        hash,
      ]);

      conn.release();

      return rows[0];
    } catch (err) {
      if (Client) {
        console.log(JSON.stringify(Client, null, 2));
      }
      throw new Error(
        `Failed to add new user ${firstName} ${lastName}. ${err}`
      );
    }
  }

  async update(id: number, user: UpdateUser): Promise<User> {
    const { firstName, lastName } = user;
    try {
      const sql =
        'UPDATE users SET firstName = $1, lastName = $2 WHERE id = $3 RETURNING *';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [firstName, lastName, id]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(
        `Failed to update user ${firstName} ${lastName}. $ ${err}`
      );
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
      return true;
    } catch (err) {
      throw new Error(`Failed to delete user ${id}. ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT password_digest FROM users WHERE username=($1)';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [username]);

      if (rows.length > 0) {
        const user = rows[0];
        if (
          bcrypt.compareSync(
            password + process.env.BCRYPT_PASSWORD,
            user.password_digest
          )
        ) {
          return user;
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Failed to find user ${username}. ${err}`);
    }
  }
}
