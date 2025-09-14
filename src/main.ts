import {AuthenticationService} from "./services/AuthenticationService";
import {OutlookService} from "./services/OutlookService";
import {JunkEvaluation, JunkService} from "./services/junk/JunkService";
import {DiscordNotificationService} from "./services/DiscordNotifcationService";
import {EnvironmentService} from "./services/EnvironmentService";
import Email from "./entity/email";

const environmentService = new EnvironmentService();
const discordService = new DiscordNotificationService(environmentService, fetch);
const authService = new AuthenticationService(discordService, environmentService);
const junkService = new JunkService();

async function run() {
    const emailClient = new OutlookService(await authService.getAccessToken());

    const emails = await emailClient.listJunkEmails();

    if (!emails.length) {
        console.log('All junk clean!!!');
        return;
    }

    const junkEvaluations: Array<[Email, JunkEvaluation]> = emails.map(email =>
        [email, junkService.evaluate(email)]
    );

    const emailsToDelete: Array<[Email, JunkEvaluation]> = [];
    const ignoredMessages: Array<[Email, JunkEvaluation]> = [];

    junkEvaluations.forEach((entry) => {
        const destination = entry[1].isJunk ? emailsToDelete : ignoredMessages;
        destination.push(entry)
    })

    if (emailsToDelete.length) {
        await emailClient.deleteEmails(emailsToDelete.map(([email]) => email))
            .then(() => discordService.sendEmailMessage('Deleted messages', emailsToDelete));
    }

    if (ignoredMessages.length) {
        await discordService.sendEmailMessage('Ignored Messages', ignoredMessages)
    }
}

run().catch((error) => {
    console.error(error);
    discordService.sendMessage('Unexpected runtime error', [{error: error.toString()}])
        .then(() => console.log('Error sent to discord.'));
});
