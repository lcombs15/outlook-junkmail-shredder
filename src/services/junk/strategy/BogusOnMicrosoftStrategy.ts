import {JunkStrategy} from "./JunkStrategy";
import Email from "../../../entity/email";

export class BogusOnMicrosoftStrategy implements JunkStrategy {

    appliesTo(email: Email): boolean {
        const emailAddress = email.from.emailAddress.address;
        const onmicrosoftRegex = /^(new)?.*[0-9]+\@.*\.onmicrosoft.com$/;

        return onmicrosoftRegex.test(emailAddress);
    }


    getReason(email: Email): string {
        return `Bogus onmicrosoft`;
    }
}
