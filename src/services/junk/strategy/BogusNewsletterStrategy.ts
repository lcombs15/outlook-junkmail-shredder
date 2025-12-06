import { JunkStrategy } from "./JunkStrategy";
import Email from "../../../entity/email";

export class BogusNewsletterStrategy implements JunkStrategy {
    private static config: { [reason: string]: RegExp } = {
        ["Hims.wilddomain"]:
            /^Hims_(ED|Partner).*@.*(motorcycles|lat|website|space|boats)/,
        ["Team-support biz"]: /^team-support@.*(my|biz).id$/,
        ["First Last biz/web.id"]: /^([A-Z][a-z]+\.){2}.{5}@.*(biz|web).id$/,
        ["Newsletter.info"]: /^newsletters.*@.*info$/,
        ["Newsletter.[25char]@"]: /^newsletter\.[a-zA-Z]{25}@/,
        ["Medvi.[8char]"]: /^Medvi\.[a-zA-Z]{8}@/,
        ["Noun+number@"]: /^[a-zA-Z]+\+[0-9]+@/,
        ["Fun police"]: /^support@.*fun/,
        ["Not hotmail"]: /^(Starbucks|...Rewards).*@hotmail\.com$/,
        ["first.last@.my.id"]:
            /^(support.*|([A-Z][a-z].*.){2}.{5})@.*\.my\.id$/,
        ["Omaha Steaks"]: /^info@omahasteaks.*\.com$/,
    };

    private calculateReason(email: Email): string | null {
        const emailAddress = email.from.emailAddress.address;
        return (
            Object.entries(BogusNewsletterStrategy.config).find(([, expr]) =>
                expr.test(emailAddress),
            )?.[0] || null
        );
    }

    appliesTo(email: Email): boolean {
        return !!this.calculateReason(email);
    }

    getReason(email: Email): string {
        return `Bogus newsletter - ${this.calculateReason(email)}`;
    }
}
