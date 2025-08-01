import "isomorphic-fetch";
import {AuthenticationService} from "./services/AuthenticationService";
import {HotmailService} from "./services/HotmailService";
import {JunkService} from "./services/junk/JunkService";
import {JunkSummaryReportService} from "./services/JunkSummaryReportService";
import {DiscordNotificationService} from "./services/DiscordNotifcationService";
import {EnvironmentService} from "./services/EnvironmentService";

async function run() {
    const environmentService = new EnvironmentService();
    const discordService = new DiscordNotificationService(environmentService);
    const authService = new AuthenticationService(discordService, environmentService);
    const emailClient = new HotmailService(await authService.getAccessToken());
    const junkService = new JunkService();
    const junkReportService = new JunkSummaryReportService();

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

    await emailClient.deleteEmails(emailsToDelete).then(
        () => {
            emailsToDelete.length && discordService.sendEmailMessage('Deleted messages', emailsToDelete)
        }
    );

    const ignoredMessages = junkEvaluations.filter(evl => !evl.evaluation.isJunk)
        .map(evl => evl.email);

    if (ignoredMessages.length) {
        await discordService.sendEmailMessage('Ignored Messages', ignoredMessages)
    }
}

run().catch((error) => {
    console.error(error);
    const discordService = new DiscordNotificationService(new EnvironmentService());
    discordService.sendMessage('Unexpected runtime error', [{
        error: error.toString()
    }]).then(() => console.log('Error sent to discord.'));
});
