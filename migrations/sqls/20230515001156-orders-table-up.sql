CREATE TABLE
    orders (
        id SERIAL PRIMARY KEY,
        status VARCHAR(64) NOT NULL,
        user_id BIGINT REFERENCES users (id),
        order_time TIMESTAMP NOT NULL
    );