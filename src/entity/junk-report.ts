import Email from "./email";

export interface JunkReport {
    junkReport: JunkReportSection
    notJunkReport: JunkReportSection
}

export interface JunkReportSection {
    [reason: string]: Array<Email>;
}
