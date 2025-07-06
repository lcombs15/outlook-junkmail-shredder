import {JunkStrategy} from "./JunkStrategy";
import Email from "../../../entity/email";

export class BogusNewsletterStrategy implements JunkStrategy {

    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address;
        const newsletterDotInfoRegex = /^newsletters.*@.*info$/;

        return emailAddress.startsWith("newsletter.l-combs") ||
            newsletterDotInfoRegex.test(emailAddress);
    }

    getReason(email: Email): string {
        return `Bogus newsletter`;
    }
}
