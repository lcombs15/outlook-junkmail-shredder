import { JunkStrategy } from "./JunkStrategy";
import Email from "../../../entity/email";

export class DontKnowMyNameDotInfo implements JunkStrategy {
    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address || '';
        const renewInfoRegex = /^(renew|renev|newsletter).....@.*.info$/;

        // Check if email address matches the pattern and body contains 'l-combs,'
        return (
            renewInfoRegex.test(emailAddress) &&
            email.subject.includes("l-combs,")
        );
    }

    getReason(email: Email): string {
        return "Don't know my name .info";
    }
}
