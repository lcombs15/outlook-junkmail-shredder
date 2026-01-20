import knex, { Knex } from "knex";

export class DatabaseService {
    private readonly db: Knex<any, any[]>;

    private readonly databaseReady: Promise<any>;

    constructor() {
        this.db = knex<any, any[]>({
            client: "better-sqlite3",
            connection: {
                filename: `./database.sqlite3`,
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
