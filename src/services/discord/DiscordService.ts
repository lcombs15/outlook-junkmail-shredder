import {EnvironmentService} from "../EnvironmentService";
import {EnvironmentVariableName} from "../../entity/EnvironmentVariable";

export class DiscordService {
    private readonly url: string | null;

    constructor(environmentService: EnvironmentService, private httpClient: typeof fetch) {
        this.url = environmentService.getValueFromFile(EnvironmentVariableName.DISCORD_URL_FILE);
    }

    private async postMessage(messageTitle: string, embeds: Array<Record<string, string>>): Promise<void> {
        if (!this.url) {
            console.warn('Discord URL not provided, skipping notification');
            return;
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
            await this.httpClient(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            console.log('Discord notification sent successfully', embeds);
        } catch (error) {
            console.error('Error sending Discord notification:', error);
            throw error;
        }
    }

    public async sendMessage(messageTitle: string, embeds: Array<Record<string, string>>): Promise<void> {
        if (!embeds.length) {
            return;
        }

        // Discord will 400 if the payload is too large
        await this.postMessage(messageTitle, embeds.slice(0, 10));
        await this.sendMessage(messageTitle, embeds.splice(10));
    }
}
