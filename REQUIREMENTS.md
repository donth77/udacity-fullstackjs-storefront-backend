# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index: `GET /products`
- Show: `GET /products/:id`
- Create [token required]: `POST /products`
- Delete [token required]: `DELETE /products/:id`
- Top 5 most popular products: `GET /dashboard/five-most-popular`
- Products by category (args: product category) `GET /products?category=<category>`

#### Users

- Index [token required]: `GET /users`
- Show [token required]: `GET /users/:id`
- Create: `POST /users`
- Update [token required]: `PUT /users/:id`
- Delete [token required]: `DELETE /users/:id`
- Authenticate: `POST '/users/authenticate`

#### Orders

- Index [token required]: `GET /orders/`
- Show [token required]: `GET /orders/:id`
- Create: `POST /orders`
- Update status: `PUT /orders/:id`
- Add Product: `POST /orders/:id/products`
- Current Order by user (args: user id)[token required]: `GET /orders?userid=<id>&status=active`
- [OPTIONAL] Completed Orders by user (args: user id)[token required]: `GET /orders?userid=<id>&status=complete`

#### Dashboard Queries

- 5 most popular products: `GET /dashboard/five-most-popular`
- 5 most expensive products: `GET /dashboard/five-most-expensive`

## Data Shapes

#### Product

- id
- name
- price
- category

Query / schema for products table:

```
CREATE TABLE
    products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        price REAL NOT NULL,
        category VARCHAR(64) NOT NULL
    );
```

#### User

- id
- firstname
- lastname
- username
- password

Query / schema for users table:

```
CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(256) NOT NULL,
        lastname VARCHAR(256) NOT NULL,
        username VARCHAR(256) NOT NULL,
        password_digest VARCHAR(256) NOT NULL
    );
```

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- order_time
- status of order (active or complete)

Query / schema for orders table:

```
CREATE TABLE
    orders (
        id SERIAL PRIMARY KEY,
        status VARCHAR(64) NOT NULL,
        user_id BIGINT REFERENCES users (id),
        order_time TIMESTAMP NOT NULL
    );

```

Query / schema for order_products table:

```
CREATE TABLE
    order_products (
        id SERIAL PRIMARY KEY,
        quantity INTEGER,
        order_id BIGINT REFERENCES orders (id),
        product_id BIGINT REFERENCES products (id)
    );
```
