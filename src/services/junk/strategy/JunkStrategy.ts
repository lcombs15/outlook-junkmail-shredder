import { Outlook } from "../../../entity/outlook";

export interface JunkStrategy {
    appliesTo(email: Outlook.Email): boolean;
    getReason(email: Outlook.Email): string;
}
