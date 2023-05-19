CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(256) NOT NULL,
        lastName VARCHAR(256) NOT NULL,
        username VARCHAR(256) NOT NULL,
        password_digest VARCHAR(256) NOT NULL
    );