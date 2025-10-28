import Email from "./email";

export interface EmailSummary {
    [email: string]: {
        timestamps: Array<string>;
        total: number;
    }
}

export interface GroupEmailSummary {
    details: {
        [reason: string]: {
            summary: EmailSummary;
            total: number;
        }
    }
    total: number;
}

export interface SummaryReport {
    deleted: GroupEmailSummary,
    ignored: GroupEmailSummary;
}