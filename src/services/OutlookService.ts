import { Client } from "@microsoft/microsoft-graph-client";
import Email from "../entity/email";

export class OutlookService {
    private graphClient;
    private static MAX_BATCH_SIZE = 20;

    public constructor(accessTokenProvider: () => Promise<string>) {
        this.graphClient = Client.init({
            authProvider: (done) =>
                accessTokenProvider().then((token) => done(null, token)),
        });
    }

    public async listJunkEmails(): Promise<Array<Email>> {
        const response = await this.graphClient
            .api("/me/mailFolders/junkemail/messages")
            .select(
                "subject,from,receivedDateTime,id,sender,body,toRecipients,ccRecipients,bccRecipients",
            )
            .top(100)
            .orderby("receivedDateTime desc")
            .get();

        return response.value as Array<Email>;
    }

    public async deleteEmails(emails: Array<Email>): Promise<void> {
        if (!emails.length) {
            return;
        }

        if (emails.length > OutlookService.MAX_BATCH_SIZE) {
            const remainder = emails.slice(OutlookService.MAX_BATCH_SIZE);
            emails = emails.slice(0, OutlookService.MAX_BATCH_SIZE);
            await this.deleteEmails(remainder);
        }

        await this.graphClient.api("/$batch").post({
            requests: emails.map((email, index) => ({
                id: String(index),
                method: "DELETE",
                url: `/me/messages/${email.id}`,
            })),
        });

        emails.forEach((email) => {
            console.log(`Deleted: ${email.subject?.trim() || "empty subject"}`);
        });
    }
}
