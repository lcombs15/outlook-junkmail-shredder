import {Configuration, DeviceCodeRequest, PublicClientApplication} from "@azure/msal-node";
import "isomorphic-fetch";
import clipboard from "clipboardy";
import * as fs from "fs";
import * as path from "path";

const cacheFile = path.join(process.cwd(), "msal-cache.json");

const msalConfig: Configuration = {
    auth: {
        clientId: process.env.CLIENT_ID || 'NO CLIENT ID',
        authority: "https://login.microsoftonline.com/consumers", // For Live.com personal accounts
    },
    cache: {
        cachePlugin: {
            beforeCacheAccess: async (context) => {
                if (fs.existsSync(cacheFile)) {
                    context.tokenCache.deserialize(fs.readFileSync(cacheFile, "utf-8"));
                }
            },
            afterCacheAccess: async (context) => {
                if (context.cacheHasChanged) {
                    fs.writeFileSync(cacheFile, context.tokenCache.serialize());
                }
            }
        }
    }
};

const tokenRequest: DeviceCodeRequest = {
    deviceCodeCallback: (response) => {
        console.log("\n🔑 DEVICE CODE LOGIN:");
        console.log(response.message); // Shows where to go and what code to enter
        clipboard.writeSync(response.userCode)
    },
    scopes: [
        "https://graph.microsoft.com/Mail.ReadWrite",
        "https://graph.microsoft.com/User.Read",
        "offline_access"
    ],
};

export async function getAccessToken(): Promise<string> {
    const pca = new PublicClientApplication(msalConfig);
    try {
        // Try to acquire token silently first (using refresh token from cache)
        try {
            const accounts = await pca.getTokenCache().getAllAccounts();
            if (accounts.length > 0) {
                const silentRequest = {
                    account: accounts[0],
                    scopes: tokenRequest.scopes,
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
        const result = await pca.acquireTokenByDeviceCode(tokenRequest);

        if (result) {
            console.debug({scopes: result.scopes})
            return result.accessToken
        }
    } catch (error) {
        console.log(error);
    }
    return Promise.reject("Access token not found");
}
