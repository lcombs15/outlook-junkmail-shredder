export interface HistoryResult {
    id: number;
    fromEmail: string;
    wasShredded: boolean;
    shreddedReason: string;
    subject?: string;
    receiveAt: string;
}

export async function listHistory(): Promise<Array<HistoryResult>> {
    const response = await fetch("/api/history/ignored");
    const data = await response.json();
    return data.content;
}

export async function getHistoryById(id: number): Promise<HistoryResult> {
    const response = await fetch(`/api/history/${id}`);
    return response.json();
}
