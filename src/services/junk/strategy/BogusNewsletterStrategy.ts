import {JunkStrategy} from "./JunkStrategy";
import Email from "../../../entity/email";

export class BogusNewsletterStrategy implements JunkStrategy {

    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address;
        const newsletterDotInfoRegex = /^newsletters.*@.*info$/;
        const specificJunkNewsletterRegex = /^newsletter\.[a-zA-Z]{25}\@/;
        // Medvi.vvyxslyi@
        const mediviSpecificJunkNewsletterRefex = /^Medvi\.[a-zA-Z]{8}\@/;
        //Blood+22@
        const strangePlusNumbers = /^[a-zA-Z]+\+[0-9]+\@/;

        return emailAddress.startsWith("newsletter.l-combs") || !![
            newsletterDotInfoRegex,
            specificJunkNewsletterRegex,
            mediviSpecificJunkNewsletterRefex,
            strangePlusNumbers
        ].find(expr => expr.test(emailAddress))
    }

    getReason(email: Email): string {
        return `Bogus newsletter`;
    }
}
