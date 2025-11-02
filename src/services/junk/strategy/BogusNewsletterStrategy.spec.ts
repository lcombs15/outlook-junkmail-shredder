import {BogusNewsletterStrategy} from "./BogusNewsletterStrategy";
import Email from "../../../entity/email";


describe('BogusNewsletterStrategy', () => {
    const strategy = new BogusNewsletterStrategy();

    function getEmail(address: string): Email {
        const tempEmail: Partial<Email> = {
            from: {
                emailAddress: {
                    address,
                    name: ''
                }
            }
        }

        return tempEmail as Email
    }

    it('should return true and false for appliesTo', () => {
        expect(strategy.appliesTo(getEmail('support@blahblahblah.fun'))).toBeTruthy();
        expect(strategy.appliesTo(getEmail('steve@apple.com'))).toBeFalsy();
    });

    it('should return a proper reason', () => {
        expect(strategy.getReason(getEmail('support@blahblahblah.fun'))).toBe("Bogus newsletter - Fun police");
    });
})
