import "isomorphic-fetch";
import {getAccessToken} from "./auth/getToken";
import {EmailClient} from "./services/EmailClient";
import {JunkService} from "./services/junk/JunkService";
import {JunkSummaryReportService} from "./services/JunkSummaryReportService";
import {DiscordNotificationService} from "./services/DiscordNotifcationService";

async function run() {
    const discordService = new DiscordNotificationService();
    const emailClient = new EmailClient(await getAccessToken());
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
            emailsToDelete.length && discordService.sendDiscordMessage('Deleted messages', emailsToDelete.map(junkReportService.formatEmailOneLine))
        }
    );

    const ignoredMessages = junkEvaluations.filter(evl => !evl.evaluation.isJunk)
        .map(evl => evl.email)
        .map(junkReportService.formatEmailOneLine);

    if (ignoredMessages.length) {
        await discordService.sendDiscordMessage('Ignored Messages', ignoredMessages)
    }
}

run().catch(console.error);
