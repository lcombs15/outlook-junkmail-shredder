import { ExcludeId, OptionalTimestamps } from "./common";

export namespace Email {
    export interface Model {
        id: number;
        from_address: string;
        was_shredded: boolean;
        send_date: string;
        created_at: Date;
        updated_at: Date;
        shredded_reason: string;
    }

    export type Create = ExcludeId<OptionalTimestamps<Model>>;

    export type Update = Partial<ExcludeId<Model>>;
}
