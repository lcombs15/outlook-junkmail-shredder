import "isomorphic-fetch";
import {AuthenticationService} from "./services/AuthenticationService";
import {OutlookService} from "./services/OutlookService";
import {JunkService} from "./services/junk/JunkService";
import {JunkSummaryReportService} from "./services/JunkSummaryReportService";
import {DiscordNotificationService} from "./services/DiscordNotifcationService";
import {EnvironmentService} from "./services/EnvironmentService";

const environmentService = new EnvironmentService();
const discordService = new DiscordNotificationService(environmentService);
const authService = new AuthenticationService(discordService, environmentService);
const junkService = new JunkService();
const junkReportService = new JunkSummaryReportService();

async function run() {
    const emailClient = new OutlookService(await authService.getAccessToken());

    const emails = await emailClient.listJunkEmails();

    if (!emails.length) {
        console.log('All junk clean!!!');
        return;
    }

    const junkEvaluations = emails.map(email => {
        return {
            email,
            evaluation: junkService.evaluate(email)
        };
    });

    junkReportService.printReport(junkReportService.getReport(junkEvaluations));

    const emailsToDelete = junkEvaluations
        .filter(evaluation => evaluation.evaluation.isJunk)
        .map(({email}) => email);

    if (emailsToDelete.length) {
        await emailClient.deleteEmails(emailsToDelete)
            .then(() => discordService.sendEmailMessage('Deleted messages', emailsToDelete));
    }

    const ignoredMessages = junkEvaluations.filter(evl => !evl.evaluation.isJunk)
        .map(evl => evl.email);

    if (ignoredMessages.length) {
        await discordService.sendEmailMessage('Ignored Messages', ignoredMessages)
    }
}

run().catch((error) => {
    console.error(error);
    discordService.sendMessage('Unexpected runtime error', [{error: error.toString()}])
        .then(() => console.log('Error sent to discord.'));
});
