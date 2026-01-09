import { JunkStrategy } from "./JunkStrategy";
import Email from "../../../entity/email";

export class DontKnowMyNameDotInfo implements JunkStrategy {
    appliesTo({ from, subject }: Email): boolean {
        const emailAddress = from.emailAddress.address || "";
        const renewInfoRegex = /^(renew|renev|newsletter).....@.*.info$/;

        // Check if email address matches the pattern and body contains 'l-combs,'
        return (
            renewInfoRegex.test(emailAddress) &&
            !!subject &&
            subject.includes("l-combs,")
        );
    }

    getReason(email: Email): string {
        return "Don't know my name .info";
    }
}
