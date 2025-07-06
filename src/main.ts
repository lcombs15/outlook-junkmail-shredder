import "isomorphic-fetch";
import {getAccessToken} from "./auth/getToken";
import {EmailClient} from "./services/EmailClient";
import {JunkService} from "./services/junk/JunkService";
import {JunkSummaryReportService} from "./services/JunkSummaryReportService";

async function run() {
    const emailClient = new EmailClient(await getAccessToken());
    const junkService = new JunkService();
    const junkReportService = new JunkSummaryReportService();

    const emails = await emailClient.listJunkEmails();

    const junkEvaluations = emails.map(email => {
        return {
            email,
            evaluation: junkService.evaluate(email)
        };
    });

    junkReportService.printReport(junkReportService.getReport(junkEvaluations));

    await Promise.all(junkEvaluations.filter(evaluation => evaluation.evaluation.isJunk)
        .map(({email}) => emailClient.deleteEmail(email)))
}

run().catch(console.error);
