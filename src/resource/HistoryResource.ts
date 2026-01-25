export interface HistoryResource {
    id: number;
    fromEmail: string;
    wasShredded: boolean;
    shreddedReason: string;
    receiveAt: string;
}
