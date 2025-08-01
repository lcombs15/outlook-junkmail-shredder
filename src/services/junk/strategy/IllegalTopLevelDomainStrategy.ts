import {JunkStrategy} from "./JunkStrategy";
import Email from "../../../entity/email";

export class IllegalTopLevelDomainStrategy implements JunkStrategy {
    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address;
        return [".de", ".ac.ke"].some(tld => emailAddress.endsWith(tld));
    }

    getReason(email: Email): string {
        return "Illegal top-level domain";
    }
}
