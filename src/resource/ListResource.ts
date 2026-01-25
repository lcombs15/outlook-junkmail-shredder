export interface ListResource<T> {
    content: Array<T>;
    total: number;
}

export function buildListResource<T>(content: Array<T>): ListResource<T> {
    return { content: content, total: content.length || 0 };
}
