import { DatabaseService } from "./DatabaseService";
import { Email } from "../../entity/db/Email";

export class EmailPersistenceService {
    constructor(private db: DatabaseService) {}

    async create(emails: Array<Email.Create>): Promise<Array<number>> {
        const records = await Promise.all(
            emails.map(async (email) =>
                (await this.db.getDatabase())("emails")
                    .insert(email)
                    .onConflict()
                    .ignore(),
            ),
        );

        return records.flatMap((ids) => ids);
    }

    async find(query?: {
        shredded?: boolean;
        searchTerm?: string;
    }): Promise<Email.Model[]> {
        const connection = await this.db.getDatabase();

        return connection("emails")
            .select("*")
            .whereIn(
                "was_shredded",
                query?.shredded == undefined ? [true, false] : [query.shredded],
            )
            .andWhereLike(
                "from_address",
                ["%", query?.searchTerm ?? "", "%"].join(""),
            );
    }

    async getById(id: number): Promise<Email.Model | undefined> {
        const connection = await this.db.getDatabase();

        return connection("emails").select().where("id", id).first();
    }
}
