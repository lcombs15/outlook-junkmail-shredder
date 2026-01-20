import { Outlook } from "../entity/outlook";

export function buildEmail(address?: string): Outlook.Email {
    const tempEmail: Partial<Outlook.Email> = {
        from: {
            emailAddress: {
                address,
                name: "",
            },
        },
    };

    return tempEmail as Outlook.Email;
}
