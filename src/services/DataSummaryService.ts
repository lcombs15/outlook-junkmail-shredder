import { Outlook } from "../entity/outlook";
import { Email } from "../entity/db/Email";
import { JunkEvaluation, JunkService } from "./junk/JunkService";
import { EmailPersistenceService } from "./db/EmailPersistenceService";
import { buildEmail } from "../tools/buildEmail";
import { DiscordService } from "./discord/DiscordService";

export class DataSummaryService {
    constructor(
        private emailPersistenceService: EmailPersistenceService,
        private junkService: JunkService,
        private discordService: DiscordService,
    ) {}

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

    public async reconcile() {
        const ignoredRecords = await this.emailPersistenceService.find({
            shredded: false,
        });

        const recordsToUpdate = ignoredRecords
            .map((record) => {
                const evaluation = this.junkService.evaluate(
                    buildEmail(record.from_address),
                );

                return { record, evaluation };
            })
            .filter(({ evaluation }) => evaluation.isJunk);

        await Promise.all(
            recordsToUpdate.map(({ record, evaluation }) => {
                return this.emailPersistenceService.markAsShredded(
                    record.id,
                    evaluation.reason,
                );
            }),
        );

        if (recordsToUpdate.length) {
            await this.discordService.sendMessage(
                "Reconciled messages",
                recordsToUpdate.map(({ record, evaluation }) => {
                    return {
                        from: record.from_address,
                        reason: evaluation.reason,
                        id: `${record.id}`,
                    };
                }),
            );
        }
    }
}
