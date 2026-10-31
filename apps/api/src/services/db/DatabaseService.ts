import knex, { Knex } from "knex";
import { EnvironmentService } from "../EnvironmentService";
import { EnvironmentVariableName } from "../../entity/EnvironmentVariable";
import type Database from "better-sqlite3";

export class DatabaseService {
    private readonly db: Knex<any, any[]>;

    private readonly databaseReady: Promise<any>;

    constructor(environmentService: EnvironmentService) {
        this.db = knex<any, any[]>({
            client: "better-sqlite3",
            connection: {
                filename:
                    environmentService.getValue(
                        EnvironmentVariableName.DATABASE_FILE,
                    ) || "./database.sqlite3",
            },
            useNullAsDefault: true,
            debug:
                environmentService.getValue(
                    EnvironmentVariableName.NODE_ENV,
                ) === "dev",
            pool: {
                afterCreate: (
                    connection: Database.Database,
                    done: () => void,
                ) => {
                    connection.function(
                        "regexp",
                        (pattern: string, value: string) => {
                            if (!value) return 0;
                            return new RegExp(pattern).test(value) ? 1 : 0;
                        },
                    );
                    done();
                },
            },
        });

        this.databaseReady = this.db.migrate.latest({
            directory: "src/migrations",
        });

        this.databaseReady
            .then()
            .catch((error) =>
                console.error("Error migrating database:", error),
            );
    }

    public async close(): Promise<void> {
        await this.databaseReady;
        await this.db.destroy();
    }

    public async getDatabase(): Promise<Knex<any, any[]>> {
        await this.databaseReady;
        return this.db;
    }
}
