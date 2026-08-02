import { JunkStrategy } from "./JunkStrategy";
import { Outlook } from "../../../entity/outlook";

export class BogusOnMicrosoftStrategy implements JunkStrategy {
    appliesTo(email: Outlook.Email): boolean {
        const emailAddress = email.from.emailAddress.address || "";
        const newsOnmicrosoftRegex = /^(new)?.*[0-9]+@.*\.onmicrosoft.com$/;
        const longFormOnMicrosoftRegex =
            /@([A-Za-z-.]+[.-]*([0-9]+)\.([a-zA-Z0-9]+).(ONMICROSOFT.COM|onmicrosoft.com))/;

        const firstDotLastAtSomethingNumber =
            /[a-z]+\.[a-z]+\@[a-z]+[0-9]{2,}\.onmicrosoft\.com/;

        return [
            newsOnmicrosoftRegex,
            longFormOnMicrosoftRegex,
            firstDotLastAtSomethingNumber,
        ].some((regex) => regex.test(emailAddress));
    }

    getReason(email: Outlook.Email): string {
        return `Bogus onmicrosoft`;
    }
}
