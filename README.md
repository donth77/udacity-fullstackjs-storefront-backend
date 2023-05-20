# Storefront Backend Project

## Installation

Run the following command:
`yarn install`

## Envrironment Variables

The `.env.template` file contains a template for the `.env` file. Rename this file or create the `.env` file and fill in the required values:

```
POSTGRES_HOST=127.0.0.1
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=

POSTGRES_DB_DEV=storefront_dev
POSTGRES_DB_TEST=storefront_test

ENV=dev

BCRYPT_PASSWORD=
SALT_ROUNDS=10
TOKEN_SECRET=
```

## Setup

1.  `docker-compose up -d`
2.  `db-migrate up`

Access the PostgrqSQL command line:

1. `docker exec -it storefront-backend-postgres-1 bash
`
2. `psql -U storefront_user -d storefront_dev`

In the `.env` file, POSTGRES_USER must be `storefront_user` and POSTGRES_DB_DEV must be `storefront_dev` for this command. Otherwise substitute with appropriate values.

Delete the tables in the database:
`yarn db-down-all`

## Ports

If the `docker-compose.yml` remains the same, then the database will run on port `5432`

If `ENV` is `test`, the server will run on port `3001`. Otherwise it will run on port `3000`

## Running Locally

Run the following commands:

1. `yarn`
2. `yarn start`

See `REQUIREMENTS.md` for endpoints

## Postman Collection

A Postman collection is provided in the `Storefront-Backend.postman_collection.json` file.

Import this into Postman and all of the endpoints can easily be tested with the provided example queries

## Testing

If Docker isn't up and running, make sure it is with `docker-compose up -d`

Run the following command:
`yarn test`
