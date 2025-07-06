import "isomorphic-fetch";
import {getAccessToken} from "./auth/getToken";
import {EmailClient} from "./services/EmailClient";
import {JunkService} from "./services/junk/JunkService";

async function run() {
    const token = await getAccessToken();
    const emailClient = new EmailClient(token);
    const junkService = new JunkService();
    (await emailClient.listJunkEmails()).map(junkEmail => {
        return {email: junkEmail, evaluation: junkService.evaluate(junkEmail)}
    }).sort((a, b) => {
        if (a.evaluation.isJunk === b.evaluation.isJunk) {
            return 0;
        }

        return a.evaluation.isJunk ? -1 : 1;
    }).forEach(({email, evaluation}) => {
        console.log(`${evaluation.isJunk ? 'JUNK' : 'NOT JUNK'}: reason: ${evaluation.reason} - ${email.from.emailAddress.name}<${email.from.emailAddress.address}>: ${email.subject}`.trim().replace(/[\r\n]+| {2,}/g, ''))
    })
}

run().catch(console.error);
