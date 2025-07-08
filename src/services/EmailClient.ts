import {Client} from "@microsoft/microsoft-graph-client";
import Email from "../entity/email";

export class EmailClient {

    private graphClient;

    public constructor(accessToken: string) {
        this.graphClient = Client.init({
            authProvider: (done) => done(null, accessToken)
        });
    }

    public async listJunkEmails(): Promise<Array<Email>> {
        const response = await this.graphClient
            .api("/me/mailFolders/junkemail/messages")
            .select("subject,from,receivedDateTime,id,sender,body,toRecipients,ccRecipients,bccRecipients")
            .top(100)
            .orderby('receivedDateTime desc')
            .get();

        return response.value as Array<Email>;
    }

    public async deleteEmails(emails: Array<Email>): Promise<void> {
        if (!emails.length) {
            return;
        }

        await this.graphClient.api('/$batch').post({
            requests: emails.map((email, index) => ({
                id: String(index),
                method: "DELETE",
                url: `/me/messages/${email.id}`
            }))
        });

        emails.forEach(email => {
            console.log(`Deleted: ${email.subject.trim()}`);
        });
    }
}
