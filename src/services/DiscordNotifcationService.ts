import * as fs from "node:fs";

export class DiscordNotificationService {
    private readonly url: string;

    constructor(url_file: string = process.env.DISCORD_URL_FILE || 'no discord file') {
        this.url = fs.readFileSync(url_file).toString().trim()
    }

    public async sendDiscordMessage(messageTitle: string, embeds: Array<string>): Promise<void> {
        if (!this.url) {
            console.warn('Discord URL not provided, skipping notification');
            return Promise.resolve();
        }

        const payload = {
            content: messageTitle,
            embeds: embeds.map(embed => ({
                description: embed
            }))
        };

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`Discord notification failed: ${response.status} ${response.statusText}`);
            }
            console.log('Discord notification sent successfully');
        } catch (error) {
            console.error('Error sending Discord notification:', error);
            throw error;
        }
    }
}
