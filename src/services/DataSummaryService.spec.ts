import { DataSummaryService } from "./DataSummaryService";
import { mock, MockProxy } from "jest-mock-extended";
import { buildEmail } from "../tools/buildEmail";
import { Outlook } from "../entity/outlook";
import { JunkEvaluation } from "./junk/JunkService";
import { EmailPersistenceService } from "./db/EmailPersistenceService";

describe("DataSummaryService", () => {
    let sut: DataSummaryService;
    let persistenceService: MockProxy<EmailPersistenceService>;

    function getMockMessage(args: {
        junkReason: string;
        emailAddress: string;
        timestamp: string;
        subject?: string;
        deleted: boolean;
    }): [Outlook.Email, JunkEvaluation] {
        const email = buildEmail(args.emailAddress);

        email.receivedDateTime = args.timestamp;
        email.subject = args.subject;

        return [
            email,
            {
                isJunk: args.deleted,
                reason: args.junkReason,
            },
        ];
    }

    beforeEach(() => {
        persistenceService = mock();
        sut = new DataSummaryService(persistenceService);
    });

    it("should handle some deletions", () => {
        sut.record([
            getMockMessage({
                junkReason: "junk reason 1",
                emailAddress: "deleted1@junk.com",
                timestamp: "YESTERDAY",
                subject: "Sale starts today",
                deleted: true,
            }),
            getMockMessage({
                junkReason: "junk reason 1",
                emailAddress: "deleted1@junk.com",
                timestamp: "TODAY",
                deleted: true,
            }),
            getMockMessage({
                junkReason: "junk reason 2",
                emailAddress: "deleted3@junk.com",
                timestamp: "TODAY",
                deleted: true,
            }),
            getMockMessage({
                junkReason: "ignored",
                emailAddress: "legit@mail.com",
                timestamp: "LAST WEEK",
                deleted: false,
            }),
        ]);

        expect(persistenceService.create).toHaveBeenCalledTimes(1);
        expect(persistenceService.create.mock.calls[0][0]).toMatchSnapshot(
            "Handful of records",
        );
    });
});
