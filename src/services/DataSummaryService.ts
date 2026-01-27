import { JsonFileStore } from "../tools/JsonFileStore";
import { GroupEmailSummary, SummaryReport } from "../entity/SummaryReport";
import { Outlook } from "../entity/outlook";
import { JunkEvaluation } from "./junk/JunkService";
import { buildEmail } from "../tools/buildEmail";

export class DataSummaryService {
    private readonly report: SummaryReport;

    private getDefaultReport(): SummaryReport {
        return {
            deleted: {
                details: {},
                total: 0,
            },
            ignored: {
                details: {},
                total: 0,
            },
        };
    }

    constructor(private summaryFileStore: JsonFileStore<SummaryReport>) {
        this.report = this.getReport();
    }

    private updateSection(
        section: GroupEmailSummary,
        messages: Array<[Outlook.Email, JunkEvaluation]>,
    ): void {
        messages.forEach(([email, evaluation]) => {
            const senderEmail = email.from.emailAddress.address;
            const reason = evaluation.reason;

            if (!senderEmail) {
                console.log(
                    "Not recording message due to missing from address",
                    { ...email },
                );
                return;
            }

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
        this.flush();
    }

    public recordDeletedMessages(
        messages: Array<[Outlook.Email, JunkEvaluation]>,
    ): void {
        this.updateSection(this.report.deleted, messages);
    }

    public recordIgnoredMessages(
        messages: Array<[Outlook.Email, JunkEvaluation]>,
    ): void {
        this.updateSection(this.report.ignored, messages);
    }

    /**
     * Reconcile the ignored messages with the current state of the email client.
     * This will migrate ignored messages to the deleted section if they are no longer being ignored.
     *
     * This helps keep the ignored report slim to new rules can be easily added.
     * @param reconcileFn
     */
    public reconcileIgnoredMessages(
        reconcileFn: (email: Outlook.Email) => JunkEvaluation,
    ): void {
        const ignoredSection = this.report.ignored;

        this.report.ignored = this.getDefaultReport().ignored;

        let allIgnoredSummaries: Array<{
            emailAddress: string;
            timestamps: string[];
        }> = Object.values(ignoredSection.details)
            .map((reasonDetails) => {
                return Object.entries(reasonDetails.summary).map(
                    ([email, emailDetails]) => {
                        return {
                            emailAddress: email,
                            timestamps: emailDetails.timestamps,
                        };
                    },
                );
            })
            .flat();

        allIgnoredSummaries.forEach(({ emailAddress, timestamps }) => {
            const evaluation = reconcileFn(buildEmail(emailAddress));

            const reportArgs: Array<[Outlook.Email, JunkEvaluation]> =
                timestamps.map((timestamp) => {
                    const email = buildEmail(emailAddress);
                    email.receivedDateTime = timestamp;
                    return [email, evaluation];
                });

            if (evaluation.isJunk) {
                this.recordDeletedMessages(reportArgs);
            } else {
                this.recordIgnoredMessages(reportArgs);
            }
        });

        this.flush();
    }

    private flush(): void {
        console.log("Writing summary report");
        this.summaryFileStore.write(this.report);
    }

    public getReport(): SummaryReport {
        return this.summaryFileStore.read(this.getDefaultReport());
    }
}
