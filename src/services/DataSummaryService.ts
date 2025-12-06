import { JsonFileStore } from "../tools/JsonFileStore";
import { GroupEmailSummary, SummaryReport } from "../entity/SummaryReport";
import Email from "../entity/email";
import { JunkEvaluation } from "./junk/JunkService";

export class DataSummaryService {
    private readonly report: SummaryReport;

    constructor(private summaryFileStore: JsonFileStore<SummaryReport>) {
        this.report = summaryFileStore.read({
            deleted: {
                details: {},
                total: 0,
            },
            ignored: {
                details: {},
                total: 0,
            },
        });
    }

    private updateSection(
        section: GroupEmailSummary,
        messages: Array<[Email, JunkEvaluation]>,
    ): void {
        messages.forEach(([email, evaluation]) => {
            const senderEmail = email.from.emailAddress.address;
            const reason = evaluation.reason;

            if (!section.details[reason]) {
                section.details[reason] = {
                    summary: {},
                    total: 0,
                };
            }

            if (!section.details[reason].summary[senderEmail]) {
                section.details[reason].summary[senderEmail] = {
                    timestamps: [],
                    total: 0,
                };
            }

            const timestamps =
                section.details[reason].summary[senderEmail].timestamps;
            if (!timestamps.includes(email.receivedDateTime)) {
                timestamps.push(email.receivedDateTime);
            }

            section.details[reason].summary[senderEmail].total =
                timestamps.length;

            section.details[reason].total = Object.values(
                section.details[reason].summary,
            ).reduce((total, sender) => total + sender.timestamps.length, 0);

            section.total = Object.values(section.details).reduce(
                (total, reasonData) => total + reasonData.total,
                0,
            );
        });
    }

    public recordDeletedMessages(
        messages: Array<[Email, JunkEvaluation]>,
    ): void {
        this.updateSection(this.report.deleted, messages);
    }

    public recordIgnoredMessages(
        messages: Array<[Email, JunkEvaluation]>,
    ): void {
        this.updateSection(this.report.ignored, messages);
    }

    public flush(): void {
        this.summaryFileStore.write(this.report);
    }

    public getReport(): SummaryReport {
        return JSON.parse(JSON.stringify(this.report));
    }
}
