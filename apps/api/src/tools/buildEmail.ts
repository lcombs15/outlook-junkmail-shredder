import { Outlook } from "../entity/outlook";

export function buildEmail(address?: string): Outlook.Email {
    const tempEmail: Partial<Outlook.Email> = {
        from: {
            emailAddress: {
                address,
                name: "",
            },
        },
        sender: {
            emailAddress: {
                name: "",
                address: `sender_${address}`,
            },
        },
    };

    return tempEmail as Outlook.Email;
}
