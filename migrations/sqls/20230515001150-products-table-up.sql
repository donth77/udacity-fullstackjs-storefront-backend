CREATE TABLE
    products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        price REAL NOT NULL,
        category VARCHAR(64) NOT NULL
    );