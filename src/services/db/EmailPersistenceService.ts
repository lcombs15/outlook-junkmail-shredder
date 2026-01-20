import { DatabaseService } from "./DatabaseService";
import { Email } from "../../entity/db/Email";

export class EmailPersistenceService {
    constructor(private db: DatabaseService) {}

    async create(emails: Array<Email.Create>): Promise<Email.Model> {
        return (await this.db.getDatabase()).table("emails").insert(emails);
    }

    async find(query?: {
        shredded?: boolean;
        searchTerm?: string;
    }): Promise<Email.Model[]> {
        const connection = await this.db.getDatabase();

        return connection("emails")
            .select()
            .whereIn(
                "was_shredded",
                query?.shredded == undefined ? [true, false] : [query.shredded],
            )
            .andWhereLike(
                "from_address",
                ["%", query?.searchTerm ?? "", "%"].join(""),
            );
    }
}
