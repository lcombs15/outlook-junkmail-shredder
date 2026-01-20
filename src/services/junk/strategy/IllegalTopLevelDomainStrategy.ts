import { JunkStrategy } from "./JunkStrategy";
import { Outlook } from "../../../entity/outlook";

export class IllegalTopLevelDomainStrategy implements JunkStrategy {
    appliesTo(email: Outlook.Email): boolean {
        const emailAddress = email.from.emailAddress.address || "";
        return [
            ".de",
            ".ac.ke",
            ".cyou",
            ".quest",
            ".lat",
            ".cfd",
            "sbs",
            "ipep.edu.br",
        ].some((tld) => emailAddress.endsWith(tld));
    }

    getReason(email: Outlook.Email): string {
        return "Illegal top-level domain";
    }
}
