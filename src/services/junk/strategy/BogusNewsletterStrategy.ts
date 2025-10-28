import {JunkStrategy} from "./JunkStrategy";
import Email from "../../../entity/email";

export class BogusNewsletterStrategy implements JunkStrategy {

    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address;
        const newsletterDotInfoRegex = /^newsletters.*@.*info$/;
        const specificJunkNewsletterRegex = /^newsletter\.[a-zA-Z]{25}\@/;
        //Blood+22@
        const strangePlusNumbers = /^[A-Z]{1}[a-z]+\+[0-9]+\@/;

        return emailAddress.startsWith("newsletter.l-combs") ||
            newsletterDotInfoRegex.test(emailAddress) ||
            specificJunkNewsletterRegex.test(emailAddress) ||
            strangePlusNumbers.test(emailAddress)
    }

    getReason(email: Email): string {
        return `Bogus newsletter`;
    }
}
