import knex, { Knex } from "knex";
import { EnvironmentService } from "../EnvironmentService";
import { EnvironmentVariableName } from "../../entity/EnvironmentVariable";

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
        });

        this.databaseReady = this.handleMigration();

        this.databaseReady
            .then()
            .catch((error) =>
                console.error("Error migrating database:", error),
            );
    }

    private async handleMigration(): Promise<void> {
        const config = {
            directory: "src/migrations",
        };

        const status = await this.db.migrate.status(config).catch((error) => {
            console.error("Error getting migration status:", error);
            return -10;
        });

        if (status < 0) {
            console.log("Migrating database.");
            await this.db.migrate.latest(config);
            console.log("Migration complete.");
        }
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
