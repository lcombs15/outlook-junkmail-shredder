import Email from "../entity/email";

export function buildEmail(address: string): Email {
    const tempEmail: Partial<Email> = {
        from: {
            emailAddress: {
                address,
                name: "",
            },
        },
    };

    return tempEmail as Email;
}
