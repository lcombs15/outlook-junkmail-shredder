import { DiscordService } from "./DiscordService";
import { Outlook } from "../../entity/outlook";
import { JunkEvaluation } from "../junk/JunkService";

export class DiscordEmailNotificationService {
    public constructor(private discordService: DiscordService) {}

    private emailToString(address: Outlook.EmailAddress): string {
        if (!address?.emailAddress) {
            return "";
        }

        return `${address.emailAddress.name} [${address.emailAddress.address}]`;
    }

    public async sendEmailMessage(
        messageTitle: string,
        emails: Array<[Outlook.Email, JunkEvaluation]>,
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
