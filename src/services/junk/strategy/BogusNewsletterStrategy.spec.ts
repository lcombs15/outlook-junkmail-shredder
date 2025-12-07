import { BogusNewsletterStrategy } from "./BogusNewsletterStrategy";
import { buildEmail } from "../../../tools/buildEmail";

describe("BogusNewsletterStrategy", () => {
    const strategy = new BogusNewsletterStrategy();

    it("should return true and false for appliesTo", () => {
        expect(
            strategy.appliesTo(buildEmail("support@blahblahblah.fun")),
        ).toBeTruthy();
        expect(strategy.appliesTo(buildEmail("steve@apple.com"))).toBeFalsy();
    });

    it("should return a proper reason", () => {
        expect(strategy.getReason(buildEmail("support@blahblahblah.fun"))).toBe(
            "Bogus newsletter - Fun police",
        );
    });
});
