import type { Knex } from "knex";

const TABLE_NAME = "emails";
const COLUMN_NAME = "shredded_reason";
const FIXED_LENGTH_REASON = "Fixed length all caps";

export async function up(knex: Knex): Promise<void> {
    await knex(TABLE_NAME)
        .whereILike(COLUMN_NAME, `${FIXED_LENGTH_REASON}%`)
        .update({ [COLUMN_NAME]: FIXED_LENGTH_REASON });
}

export async function down(knex: Knex): Promise<void> {
    await knex(TABLE_NAME)
        .where(COLUMN_NAME, FIXED_LENGTH_REASON)
        .update({ [COLUMN_NAME]: FIXED_LENGTH_REASON });
}
