import { DiscordService } from "./DiscordService";
import Email, { EmailAddress } from "../../entity/email";
import { JunkEvaluation } from "../junk/JunkService";

export class DiscordEmailNotificationService {
    public constructor(private discordService: DiscordService) {}

    private emailToString(address: EmailAddress): string {
        if (!address?.emailAddress) {
            return "";
        }

        return `${address.emailAddress.name} [${address.emailAddress.address}]`;
    }

    public async sendEmailMessage(
        messageTitle: string,
        emails: Array<[Email, JunkEvaluation]>,
    ) {
        return this.discordService.sendMessage(
            messageTitle,
            emails.map(([email, junkEvaluation]) => {
                return {
                    subject: email.subject || "empty subject",
                    from: this.emailToString(email.from),
                    sender: this.emailToString(email.sender),
                    to: (email.toRecipients || [])
                        .map(this.emailToString)
                        .join(","),
                    description: junkEvaluation.reason,
                };
            }),
        );
    }
}
