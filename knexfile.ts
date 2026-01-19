import type { Knex } from "knex";

// Update with your config settings.

const getConfig = (name: string): Knex.Config => {
    return {
        client: "better-sqlite3",
        connection: {
            filename: `./${name}.sqlite3`,
        },
    };
};

const config: { [key: string]: Knex.Config } = {
    development: getConfig("dev"),
    production: getConfig("prod"),
};

module.exports = config;
