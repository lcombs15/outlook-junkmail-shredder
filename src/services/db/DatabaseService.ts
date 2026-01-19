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
        });

        this.databaseReady = this.db.migrate.latest();

        this.databaseReady
            .then(() => console.log("Database migrated"))
            .catch((error) =>
                console.error("Error migrating database:", error),
            );
    }

    public async getDatabase(): Promise<Knex<any, any[]>> {
        await this.databaseReady;
        return this.db;
    }
}
