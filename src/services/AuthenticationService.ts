import {Configuration, DeviceCodeRequest, PublicClientApplication} from "@azure/msal-node";
import clipboard from "clipboardy";
import * as fs from "fs";
import * as path from "path";
import {DiscordService} from "./discord/DiscordService";
import {EnvironmentService} from "./EnvironmentService";
import {EnvironmentVariableName} from "../entity/EnvironmentVariable";

export class AuthenticationService {
    private cacheFile = path.join(this.environmentService.getValue(EnvironmentVariableName.AUTH_DIRECTORY) || process.cwd(), "msal-cache.json");

    private msalConfig: Configuration = {
        auth: {
            clientId: (this.environmentService.getValueFromFile(EnvironmentVariableName.CLIENT_ID_FILE) || 'NO CLIENT ID').trim(),
            authority: "https://login.microsoftonline.com/consumers", // For Live.com personal accounts
        },
        cache: {
            cachePlugin: {
                beforeCacheAccess: async (context) => {
                    if (fs.existsSync(this.cacheFile)) {
                        context.tokenCache.deserialize(fs.readFileSync(this.cacheFile, "utf-8"));
                    }
                },
                afterCacheAccess: async (context) => {
                    if (context.cacheHasChanged) {
                        fs.writeFileSync(this.cacheFile, context.tokenCache.serialize());
                    }
                }
            }
        }
    };

    private tokenRequest: DeviceCodeRequest = {
        deviceCodeCallback: (response) => {
            const title = "🔑 DEVICE CODE LOGIN:";
            console.log(title, response.message); // Shows where to go and what code to enter
            this.discordService.sendMessage(title, [{
                message: response.message
            }]).then()
            this.discordService.sendMessage(response.userCode, []).then()
            try {
                clipboard.writeSync(response.userCode)
            } catch (ignore) {
            }
        },
        scopes: [
            "https://graph.microsoft.com/Mail.ReadWrite",
            "https://graph.microsoft.com/User.Read",
            "offline_access"
        ],
    };

    constructor(private discordService: DiscordService, private environmentService: EnvironmentService) {
    }

    public async getAccessToken(): Promise<string> {
        const pca = new PublicClientApplication(this.msalConfig);
        try {
            // Try to acquire token silently first (using refresh token from cache)
            try {
                const accounts = await pca.getTokenCache().getAllAccounts();
                if (accounts.length > 0) {
                    const silentRequest = {
                        account: accounts[0],
                        scopes: this.tokenRequest.scopes,
                    };

                    const silentResult = await pca.acquireTokenSilent(silentRequest);
                    if (silentResult) {
                        console.debug("Token acquired silently");
                        return silentResult.accessToken;
                    }
                }
            } catch (silentError) {
                console.debug("Silent token acquisition failed, falling back to device code flow");
            }

            // Fall back to device code flow if silent acquisition fails
            const result = await pca.acquireTokenByDeviceCode(this.tokenRequest);

            if (result) {
                return result.accessToken
            }
        } catch (error) {
            console.log(error);
        }
        return Promise.reject("Access token not found");
    }
}
