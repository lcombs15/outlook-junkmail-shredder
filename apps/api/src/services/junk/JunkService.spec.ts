import { JunkService } from "./JunkService";
import { buildEmail } from "../../tools/buildEmail";
import { JunkFixture } from "./JunkFixture";

describe("JunkService", () => {
    const service = new JunkService();

    it("should mark emails as junk", () => {
        const result = JunkFixture.junkEmailAddresses
            .map(buildEmail)
            .map((input) => {
                return {
                    input,
                    result: service.evaluate(input),
                };
            })
            .filter((result) => !result.result.isJunk)
            .map((result) => result.input.from.emailAddress.address);

        expect(result).toHaveLength(0);
    });

    it("should NOT mark emails as junk", () => {
        const result = JunkFixture.notJunkEmailAddresses
            .map(buildEmail)
            .map((input) => {
                return {
                    input,
                    result: service.evaluate(input),
                };
            })
            .filter((result) => result.result.isJunk)
            .map((result) => result.input.from.emailAddress.address);

        expect(result).toHaveLength(0);
    });

    Object.entries({
        "not junk emails": JunkFixture.notJunkEmailAddresses,
        "junk emails": JunkFixture.junkEmailAddresses,
    }).forEach(([testCase, emails]) => {
        it(`should not have any duplicate test data: ${testCase}`, () => {
            expect(new Set(emails).size).toBe(emails.length);
        });
    });

    it("Should handle an invalid email address", () => {
        const result = service.evaluate(buildEmail(undefined));

        expect(result).toBeTruthy();
        expect(result.isJunk).toBe(false);
    });
});
