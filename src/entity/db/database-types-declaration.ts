import { Knex } from "knex";
import { Email } from "./Email";

declare module "knex/types/tables" {
    interface Tables {
        emails: Knex.CompositeTableType<
            Email.Model,
            Email.Create,
            Email.Update
        >;
    }
}
