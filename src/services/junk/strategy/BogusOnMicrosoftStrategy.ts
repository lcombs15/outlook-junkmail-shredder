import { JunkStrategy } from "./JunkStrategy";
import { Outlook } from "../../../entity/outlook";

export class BogusOnMicrosoftStrategy implements JunkStrategy {
    appliesTo(email: Outlook.Email): boolean {
        const emailAddress = email.from.emailAddress.address || "";
        const onmicrosoftRegex = /^(new)?.*[0-9]+@.*\.onmicrosoft.com$/;

        return onmicrosoftRegex.test(emailAddress);
    }

    getReason(email: Outlook.Email): string {
        return `Bogus onmicrosoft`;
    }
}
