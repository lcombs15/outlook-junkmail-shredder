import knex from "knex";

export class DatabaseService {
    async example() {
        const db = knex({
            client: "better-sqlite3",
            connection: {
                filename: `./database.sqlite3`,
            },
        });
        await db.migrate.latest();

        const data = await db("emails").select("*");

        console.log(data);
    }
}
