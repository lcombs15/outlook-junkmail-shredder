export type OptionalTimestamps<
    T extends {
        created_at: Date;
        updated_at: Date;
    },
> = Omit<T, "updated_at" | "created_at"> &
    Partial<Pick<T, "created_at" | "updated_at">>;

export type ExcludeId<T> = Omit<T, "id">;
