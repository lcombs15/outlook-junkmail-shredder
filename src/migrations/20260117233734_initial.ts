import type { Knex } from "knex";
import * as fs from "node:fs";

const TABLE_NAME = "emails";
const SUMMARY_FILE_VAR = "SUMMARY_FILE";

interface SummaryContent {
    details: {
        [reason: string]: {
            summary: Record<
                string,
                {
                    timestamps: Array<string>;
                }
            >;
            total: number;
        };
    };
}

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.increments().primary();
        table.string("from_address", 255).notNullable();
        table.boolean("was_shredded").notNullable();
        table.datetime("send_date").notNullable();
        table.timestamps(true, true);
        table.string("shredded_reason", 255).notNullable();
        table.unique(["from_address", "send_date"]);
    });

    const summaryFile = process.env[SUMMARY_FILE_VAR];

    if (summaryFile && fs.existsSync(summaryFile)) {
        const { deleted, ignored } = JSON.parse(
            fs.readFileSync(summaryFile, "utf-8"),
        ) as Record<string, any>;

        const processSection = async (
            isDeleted: boolean,
            section: SummaryContent,
        ) => {
            const rows: Record<
                string,
                {
                    from_address: string;
                    send_date: string;
                    was_shredded: boolean;
                    shredded_reason: string;
                }
            > = {};

            Object.entries(section.details).forEach(([reason, { summary }]) => {
                Object.entries(summary).forEach(([address, { timestamps }]) => {
                    timestamps.forEach((timestamp) => {
                        const hashKey = `${address}-${timestamp}`;

                        const rowToAdd = {
                            from_address: address,
                            send_date: timestamp,
                            was_shredded: isDeleted,
                            shredded_reason: reason,
                        };

                        if (rows[hashKey]) {
                            const thisReason = rowToAdd.shredded_reason;
                            const thatReason = rows[hashKey].shredded_reason;

                            // Pick the longest reason
                            rowToAdd.shredded_reason =
                                thisReason.length > thatReason.length
                                    ? thisReason
                                    : thatReason;
                        }

                        rows[hashKey] = rowToAdd;
                    });
                });
            });

            await knex.batchInsert(TABLE_NAME, Object.values(rows), 100);
        };

        await processSection(true, deleted);
        await processSection(false, ignored);
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
