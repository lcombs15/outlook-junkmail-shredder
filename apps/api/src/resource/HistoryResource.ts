export interface HistoryResource {
    id: number;
    fromEmail: string;
    wasShredded: boolean;
    shreddedReason: string;
    subject?: string;
    receiveAt: string;
}
