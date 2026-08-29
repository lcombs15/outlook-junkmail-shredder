import { subMonths } from "date-fns";

export interface HistoryResult {
    id: number;
    fromEmail: string;
    wasShredded: boolean;
    shreddedReason: string;
    subject?: string;
    receiveAt: string;
}

export async function listHistory({
    searchTerm,
}: Partial<{
    searchTerm: string;
}> = {}): Promise<Array<HistoryResult>> {
    const params = new URLSearchParams();
    if (searchTerm) {
        params.append("searchTerm", searchTerm);
    } else {
        params.append("afterDate", subMonths(Date.now(), 2).toISOString());
    }

    const response = await fetch(`/api/history/ignored?${params.toString()}`);
    const data = await response.json();
    return data.content;
}

export async function getHistoryById(id: number): Promise<HistoryResult> {
    const response = await fetch(`/api/history/${id}`);
    return response.json();
}
