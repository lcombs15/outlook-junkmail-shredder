import { DiscordService } from "./discord/DiscordService";
import { DiscordEmailNotificationService } from "./discord/DiscordEmailNotificationService";
import { AuthenticationService } from "./AuthenticationService";
import { JunkEvaluation, JunkService } from "./junk/JunkService";
import { DataSummaryService } from "./DataSummaryService";
import { OutlookService } from "./OutlookService";
import { Outlook } from "../entity/outlook";
import { AppContext } from "../context/buildAppContext";

export class JunkmailShredderService {
    private readonly discordService: DiscordService;
    private readonly discordEmailService: DiscordEmailNotificationService;
    private readonly authService: AuthenticationService;
    private readonly junkService: JunkService;
    private readonly dataSummaryService: DataSummaryService;

    constructor(appContext: AppContext) {
        this.discordService = appContext.discordService;
        this.discordEmailService = appContext.discordEmailService;
        this.authService = appContext.authService;
        this.junkService = appContext.junkService;
        this.dataSummaryService = appContext.dataSummaryService;
    }

    private async getEmailClient() {
        return new OutlookService(() => this.authService.getAccessToken());
    }

    private async getCurrentEmails() {
        const emailClient = await this.getEmailClient();

        const emails = await emailClient.listJunkEmails();

        const junkEvaluations: Array<[Outlook.Email, JunkEvaluation]> =
            emails.map((email) => [email, this.junkService.evaluate(email)]);

        const emailsToDelete: Array<[Outlook.Email, JunkEvaluation]> = [];
        const ignoredMessages: Array<[Outlook.Email, JunkEvaluation]> = [];

        junkEvaluations.forEach((entry) => {
            const destination = entry[1].isJunk
                ? emailsToDelete
                : ignoredMessages;
            destination.push(entry);
        });

        return { emailsToDelete, ignoredMessages };
    }

    private async run() {
        const { emailsToDelete, ignoredMessages } =
            await this.getCurrentEmails();
        const emailClient = await this.getEmailClient();

        if (!(emailsToDelete.length + ignoredMessages.length)) {
            console.log("All junk clean!!!");
            return;
        }

        if (emailsToDelete.length) {
            await emailClient
                .deleteEmails(emailsToDelete.map(([email]) => email))
                .then(() => {
                    this.discordEmailService
                        .sendEmailMessage("Deleted messages", emailsToDelete)
                        .then();
                    this.dataSummaryService.record(emailsToDelete).then();
                });
        }

        if (ignoredMessages.length) {
            await this.discordEmailService.sendEmailMessage(
                "Ignored Messages",
                ignoredMessages,
            );
            await this.dataSummaryService.record(ignoredMessages);
        }

        if ((ignoredMessages.length || 0) + (emailsToDelete.length || 0) > 2) {
            await this.discordService.sendMessage("Summary", [
                {
                    "Deleted Count": emailsToDelete.length.toString(),
                    "Ignored Count": ignoredMessages.length.toString(),
                },
            ]);
        }
    }

    public sweepJunkEmails(): void {
        this.run()
            .then()
            .catch((error) => {
                console.error(error);
                this.discordService
                    .sendMessage("Unexpected runtime error", [
                        { error: error.toString() },
                    ])
                    .then(() => console.log("Error sent to discord."));
            });
    }

    public async deleteIgnoredMessages(): Promise<void> {
        const { ignoredMessages } = await this.getCurrentEmails();

        await this.dataSummaryService.record(ignoredMessages);

        const emailClient = await this.getEmailClient();
        await emailClient.deleteEmails(ignoredMessages.map(([email]) => email));
        await this.discordEmailService.sendEmailMessage(
            "Cleared Ignored Messages",
            ignoredMessages,
        );
    }
}
