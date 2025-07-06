import {Client} from "@microsoft/microsoft-graph-client";
import Email from "../entity/email";

export class EmailClient {

    private graphClient;

    public constructor(accessToken: string) {
        this.graphClient = Client.init({
            authProvider: (done) => done(null, accessToken),

        });
    }

    public async listJunkEmails(): Promise<Array<Email>> {
        const response = await this.graphClient
            .api("/me/mailFolders/junkemail/messages")
            .select("subject,from,receivedDateTime,id,sender,body,toRecipients,ccRecipients,bccRecipients")
            .orderby('receivedDateTime desc')
            .get();

        return response.value as Array<Email>;
    }

    public async deleteEmail(email: Email): Promise<void> {
    }
}
