import type { Knex } from "knex";

const TABLE_NAME = "emails";
const COLUMN_NAME = "sender_address";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (builder) => {
        builder.string(COLUMN_NAME, 255);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (builder) => {
        builder.dropColumn(COLUMN_NAME);
    });
}
