import { JunkStrategy } from "./JunkStrategy";
import Email from "../../../entity/email";

export class LooksLikeMyEmailStrategy implements JunkStrategy {
    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address || "";
        return /l-combs.*@/.test(emailAddress);
    }

    getReason(email: Email): string {
        return `looks like l-combs`;
    }
}
