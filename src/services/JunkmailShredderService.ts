import {EnvironmentService} from "./EnvironmentService";
import {DiscordService} from "./discord/DiscordService";
import {DiscordEmailNotificationService} from "./discord/DiscordEmailNotificationService";
import {AuthenticationService} from "./AuthenticationService";
import {JunkEvaluation, JunkService} from "./junk/JunkService";
import {DataSummaryService} from "./DataSummaryService";
import {JsonFileStore} from "../tools/JsonFileStore";
import {EnvironmentVariableName} from "../entity/EnvironmentVariable";
import {OutlookService} from "./OutlookService";
import Email from "../entity/email";
import {GroupEmailSummary, SummaryReport} from "../entity/SummaryReport";

export class JunkmailShredderService {
    private readonly discordService: DiscordService;
    private readonly discordEmailService: DiscordEmailNotificationService;
    private readonly authService: AuthenticationService;
    private readonly junkService = new JunkService();
    private readonly dataSummaryService: DataSummaryService;
    private accessToken: string | undefined = undefined;

    constructor(environmentService = new EnvironmentService()) {
        this.discordService = new DiscordService(environmentService, fetch);
        this.discordEmailService = new DiscordEmailNotificationService(this.discordService);
        this.authService = new AuthenticationService(this.discordService, environmentService);
        this.dataSummaryService = new DataSummaryService(
            new JsonFileStore(environmentService.getRequiredValue(EnvironmentVariableName.SUMMARY_FILE))
        );
    }

    private async getEmailClient() {
        this.accessToken = this.accessToken || await this.authService.getAccessToken();
        return new OutlookService(this.accessToken);
    }

    private async getCurrentEmails() {
        const emailClient = await this.getEmailClient();

        const emails = await emailClient.listJunkEmails();

        const junkEvaluations: Array<[Email, JunkEvaluation]> = emails.map(email =>
            [email, this.junkService.evaluate(email)]
        );

        const emailsToDelete: Array<[Email, JunkEvaluation]> = [];
        const ignoredMessages: Array<[Email, JunkEvaluation]> = [];

        junkEvaluations.forEach((entry) => {
            const destination = entry[1].isJunk ? emailsToDelete : ignoredMessages;
            destination.push(entry)
        });

        return {emailsToDelete, ignoredMessages};
    }

    private async run() {
        const {emailsToDelete, ignoredMessages} = await this.getCurrentEmails();
        const emailClient = await this.getEmailClient();

        if (!(emailsToDelete.length + ignoredMessages.length)) {
            console.log('All junk clean!!!');
            return;
        }

        if (emailsToDelete.length) {
            await emailClient.deleteEmails(emailsToDelete.map(([email]) => email))
                .then(() => {
                    this.discordEmailService.sendEmailMessage('Deleted messages', emailsToDelete);
                    this.dataSummaryService.recordDeletedMessages(emailsToDelete);
                });
        }

        if (ignoredMessages.length) {
            await this.discordEmailService.sendEmailMessage('Ignored Messages', ignoredMessages);
            this.dataSummaryService.recordIgnoredMessages(ignoredMessages);
        }

        if (ignoredMessages.length || emailsToDelete.length) {
            await this.discordService.sendMessage('Summary', [{
                'Deleted Count': emailsToDelete.length.toString(),
                'Ignored Count': ignoredMessages.length.toString()
            }]);
        }

        this.dataSummaryService.flush();
    }

    public sweepJunkEmails(): void {
        this.run().then().catch((error) => {
            console.error(error);
            this.discordService.sendMessage('Unexpected runtime error', [{error: error.toString()}])
                .then(() => console.log('Error sent to discord.'));
        });
    }

    public async deleteIgnoredMessages(): Promise<void> {
        const {ignoredMessages} = await this.getCurrentEmails();

        const emailClient = await this.getEmailClient();
        await emailClient.deleteEmails(ignoredMessages.map(([email]) => email));
        await this.discordEmailService.sendEmailMessage('Cleared Ignored Messages', ignoredMessages);
    }

    public getReport(): SummaryReport {
        return this.dataSummaryService.getReport();
    }

    public searchReport(section: GroupEmailSummary, minTotal?: number, searchTerm?: string) {
        const retVal: GroupEmailSummary = {
            details: {},
            total: 0
        };

        Object.entries(section.details).forEach(([reason, reasonData]) => {
            let newTotal = 0;
            const details = Object.entries(reasonData.summary).filter(([emailAddress, data]) => {
                let keep = true;
                if (minTotal && data.total < minTotal) {
                    keep = false;
                }
                if (searchTerm && !emailAddress.includes(searchTerm)) {
                    keep = false;
                }
                return keep;
            });

            details.forEach(([_, data]) => newTotal += data.total);

            if (details.length) {
                retVal.details[reason] = {
                    summary: Object.fromEntries(details),
                    total: newTotal
                };

                retVal.total += newTotal;
            }
        });

        return retVal;
    }
}
