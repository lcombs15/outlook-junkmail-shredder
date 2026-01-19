import { DataSummaryService } from "./services/DataSummaryService";
import { mock, MockProxy } from "jest-mock-extended";
import { buildEmail } from "./tools/buildEmail";
import { Outlook } from "./entity/outlook";
import { JunkEvaluation } from "./services/junk/JunkService";
import { EmailPersistenceService } from "./services/db/EmailPersistenceService";

describe("DataSummaryService", () => {
    let sut: DataSummaryService;
    let persistenceService: MockProxy<EmailPersistenceService>;

    function getMockMessage(args: {
        junkReason: string;
        emailAddress: string;
        timestamp: string;
        deleted: boolean;
    }): [Outlook.Email, JunkEvaluation] {
        const email = buildEmail(args.emailAddress);

        email.receivedDateTime = args.timestamp;

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
