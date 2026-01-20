export namespace Outlook {
    export interface Email {
        id: string;
        receivedDateTime: string;
        subject?: string;
        from: EmailAddress;
        sender: EmailAddress;
        toRecipients: Array<EmailAddress>;
        ccRecipients: Array<EmailAddress>;
        bccRecipients: Array<EmailAddress>;
        body: {
            contentType: string;
            content: string;
        };
    }

    export interface EmailAddress {
        emailAddress: {
            name: string;
            address?: string;
        };
    }
}
