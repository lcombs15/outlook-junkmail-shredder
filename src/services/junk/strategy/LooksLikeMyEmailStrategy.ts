import { JunkStrategy } from "./JunkStrategy";
import { Outlook } from "../../../entity/outlook";

export class LooksLikeMyEmailStrategy implements JunkStrategy {
    appliesTo(email: Outlook.Email): boolean {
        const emailAddress = email.from.emailAddress.address || "";
        return /l-combs.*@/.test(emailAddress);
    }

    getReason(email: Outlook.Email): string {
        return `looks like l-combs`;
    }
}
