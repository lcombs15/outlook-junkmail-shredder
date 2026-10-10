import { DatabaseService } from "./db/DatabaseService";
import { AnalyticResourceMapper } from "../mapper/AnalyticResourceMapper";
import { AnalyticCountResource } from "../resource/AnalyticCountResource";

export interface AnalyticCountResult {
    month: number;
    year: number;
    total: number;
    shredded_total: number;
    ignored_total: number;
}

export class AnalyticsService {
    constructor(
        private db: DatabaseService,
        private mapper: AnalyticResourceMapper = new AnalyticResourceMapper(),
    ) {}

    public async getCounts(
        args: {
            afterDate?: Date;
            beforeDate?: Date;
        } = {},
    ): Promise<Array<AnalyticCountResource>> {
        let sqlBuilder = await this.db.getDatabase();

        let sqlQuery = sqlBuilder("emails")
            .select(
                sqlBuilder.raw(
                    "CAST(strftime('%m', send_date) AS INTEGER) as month",
                ),
                sqlBuilder.raw(
                    "CAST(strftime('%Y', send_date) AS INTEGER) as year",
                ),
                sqlBuilder.count("id").as("total"),
                sqlBuilder.sum("was_shredded").as("shredded_total"),
                sqlBuilder
                    .sum(sqlBuilder.raw("ABS(was_shredded - 1)"))
                    .as("ignored_total"),
            )
            .groupBy("year", "month")
            .orderBy(["year", "month"]);

        const dateArgs: Array<{
            field: "afterDate" | "beforeDate";
            operator: string;
        }> = [
            {
                field: "afterDate",
                operator: ">=",
            },
            {
                field: "beforeDate",
                operator: "<",
            },
        ];

        dateArgs.forEach(({ field, operator }) => {
            const argField = args[field];
            if (argField) {
                // handles time, since we don't specify time
                // toIsoString defaults to <date>T00:00:00.000Z
                argField.setDate(argField.getDate() + 1);
                sqlQuery = sqlQuery.andWhere(
                    "send_date",
                    operator,
                    argField.toISOString(),
                );
            }
        });

        return ((await sqlQuery) as unknown as Array<AnalyticCountResult>).map(
            (record) => this.mapper.toResource(record),
        );
    }
}
