import { Outlook } from "../entity/outlook";
import { Email } from "../entity/db/Email";
import { JunkEvaluation } from "./junk/JunkService";
import { EmailPersistenceService } from "./db/EmailPersistenceService";

export class DataSummaryService {
    constructor(private emailPersistenceService: EmailPersistenceService) {}

    public async record(messages: Array<[Outlook.Email, JunkEvaluation]>) {
        return await this.emailPersistenceService.create(
            messages
                .map(([email, evaluation]) => {
                    const from = email.from.emailAddress.address;

                    if (!from) {
                        return undefined;
                    }

                    const record: Email.Create = {
                        from_address: from,
                        was_shredded: evaluation.isJunk ? 1 : 0,
                        send_date: email.receivedDateTime,
                        shredded_reason: evaluation.reason,
                    };

                    return record;
                })
                .filter((result) => !!result),
        );
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
        throw new Error("Method not implemented.");
    }

    public async getRecords(
        searchTerm?: string,
        shredded?: boolean,
    ): Promise<Array<Email.Model>> {
        return await this.emailPersistenceService.find({
            shredded,
            searchTerm,
        });
    }
}
