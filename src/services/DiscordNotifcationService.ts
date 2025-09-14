import {EnvironmentService} from "./EnvironmentService";
import {EnvironmentVariableName} from "../entity/EnvironmentVariable";
import Email, {EmailAddress} from "../entity/email";
import {JunkEvaluation} from "./junk/JunkService";

export class DiscordNotificationService {
    private readonly url: string;

    constructor(environmentService: EnvironmentService, private httpClient = fetch) {
        this.url = environmentService.getValueFromFile(EnvironmentVariableName.DISCORD_URL_FILE) || 'no discord file';
    }

    private emailToString(address: EmailAddress): string {
        if (!address?.emailAddress) {
            return '';
        }

        return `${address.emailAddress.name} [${address.emailAddress.address}]`
    }

    public async sendEmailMessage(messageTitle: string, emails: Array<[Email, JunkEvaluation]>) {
        return this.sendMessage(messageTitle, emails.map(([email, junkEvaluation]) => {
            return {
                subject: email.subject,
                from: this.emailToString(email.from),
                sender: this.emailToString(email.sender),
                to: (email.toRecipients || []).map(this.emailToString).join(','),
                description: junkEvaluation.reason
            }
        }));
    }

    public async sendMessage(messageTitle: string, embeds: Array<Record<string, string>>): Promise<void> {
        if (!this.url) {
            console.warn('Discord URL not provided, skipping notification');
            return Promise.resolve();
        }

        const payload = {
            content: messageTitle,
            embeds: embeds.map(embed => {
                return {
                    fields: Object.entries(embed)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => {
                            return {
                                name: key,
                                value: value.substring(0, 1024),
                            }
                        })
                }
            })
        };

        try {
            const response = await this.httpClient(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.error(JSON.stringify(payload));
                throw new Error(`Discord notification failed: ${response.status} ${response.statusText}`);
            }
            console.log('Discord notification sent successfully', embeds);
        } catch (error) {
            console.error('Error sending Discord notification:', error);
            throw error;
        }
    }
}
