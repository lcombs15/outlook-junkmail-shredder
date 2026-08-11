export interface HistoryResult {
    id: number;
    fromEmail: string;
    wasShredded: boolean;
    shreddedReason: string;
    subject?: string;
    receiveAt: string;
}

export function useHistory(): Promise<Array<HistoryResult>> {
    return fetch("/api/history/ignored")
        .then((response) => response.json())
        .then((data) => data.content);
}
