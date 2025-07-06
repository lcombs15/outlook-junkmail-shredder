import Email from "../../../entity/email";

export interface JunkStrategy {
    appliesTo(email: Email): boolean;
    getReason(email: Email): string;
}