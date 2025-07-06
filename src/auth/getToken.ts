import {Configuration, DeviceCodeRequest, PublicClientApplication} from "@azure/msal-node";
import "isomorphic-fetch";
import clipboard from "clipboardy";

const msalConfig: Configuration = {
    auth: {
        clientId: process.env.CLIENT_ID || 'NO CLIENT ID',
        authority: "https://login.microsoftonline.com/consumers", // For Live.com personal accounts
    },
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
    correlationId: "lucas-local"
};

export async function getAccessToken(): Promise<string> {
    if (process.env.ACCESS_TOKEN) {
        return process.env.ACCESS_TOKEN;
    }

    const pca = new PublicClientApplication(msalConfig);
    try {
        const result = await pca.acquireTokenByDeviceCode(tokenRequest);

        if (result) {
            console.log({scopes: result.scopes})
            return result.accessToken
        }
    } catch (error) {
        console.log(error);
    }
    return Promise.reject("Access token not found");
}
