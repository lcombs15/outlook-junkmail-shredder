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
                        subject_line: email.subject,
                        shredded_reason: evaluation.reason,
                    };

                    return record;
                })
                .filter((result) => !!result),
        );
    }
}
