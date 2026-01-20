import { DataSummaryService } from "./services/DataSummaryService";
import { JsonFileStore } from "./tools/JsonFileStore";
import { SummaryReport } from "./entity/SummaryReport";
import { mock, MockProxy } from "jest-mock-extended";
import { buildEmail } from "./tools/buildEmail";
import { Outlook } from "./entity/outlook";
import { JunkEvaluation } from "./services/junk/JunkService";

describe("DataSummaryService", () => {
    let sut: DataSummaryService;
    let fileStore: MockProxy<JsonFileStore<SummaryReport>>;

    function getMockMessage(args: {
        junkReason: string;
        emailAddress: string;
        timestamp: string;
    }): [Outlook.Email, JunkEvaluation] {
        const email = buildEmail(args.emailAddress);

        email.receivedDateTime = args.timestamp;

        return [
            email,
            {
                isJunk: false,
                reason: args.junkReason,
            },
        ];
    }

    beforeEach(() => {
        fileStore = mock();
        fileStore.read.mockImplementation((defaultValue) => defaultValue);
        sut = new DataSummaryService(fileStore);
    });

    it("should initialize the report with the correct values", () => {
        expect(fileStore.read).toHaveBeenCalledTimes(1);
        expect(fileStore.read.mock.calls[0][0]).toMatchSnapshot(
            "Default file store",
        );
    });

    it("should handle some deletions", () => {
        // This should only record the 'yesterday' deletion once
        for (let i = 0; i < 5; i++) {
            sut.recordDeletedMessages([
                getMockMessage({
                    junkReason: "junk reason 1",
                    emailAddress: "deleted1@junk.com",
                    timestamp: "YESTERDAY",
                }),
            ]);
        }

        sut.recordDeletedMessages([
            getMockMessage({
                junkReason: "junk reason 1",
                emailAddress: "deleted1@junk.com",
                timestamp: "TODAY",
            }),
        ]);

        sut.recordDeletedMessages([
            getMockMessage({
                junkReason: "junk reason 2",
                emailAddress: "deleted3@junk.com",
                timestamp: "TODAY",
            }),
        ]);

        sut.flush();

        expect(fileStore.write).toHaveBeenCalledTimes(1);
        expect(fileStore.write.mock.calls[0][0]).toMatchSnapshot(
            "Handful of deletions",
        );
    });

    it("should handle reconciliation of ignored messages", () => {
        const REASON_1 = "reason 1";
        const REASON_2 = "reason 2";
        const REASON_IGNORED = "ignored";

        sut.recordIgnoredMessages([
            getMockMessage({
                junkReason: REASON_IGNORED,
                timestamp: "LAST WEEK",
                emailAddress: "delete@me.com",
            }),
            getMockMessage({
                junkReason: REASON_IGNORED,
                timestamp: "YESTERDAY",
                emailAddress: "some@randon.email",
            }),
            getMockMessage({
                junkReason: REASON_IGNORED,
                timestamp: "YESTERDAY",
                emailAddress: "some2@randon.email",
            }),
        ]);

        sut.recordDeletedMessages([
            getMockMessage({
                junkReason: REASON_1,
                timestamp: "TODAY",
                emailAddress: "delete@me.com",
            }),
            getMockMessage({
                junkReason: REASON_2,
                timestamp: "TODAY",
                emailAddress: "anotherDeleted@me.com",
            }),
        ]);

        sut.flush();
        expect(fileStore.write.mock.calls[0][0]).toMatchSnapshot(
            "Pre reconcile",
        );

        sut.reconcileIgnoredMessages((email) => {
            const isJunk =
                !!email.from.emailAddress.address?.includes("delete");

            return {
                isJunk,
                reason: isJunk ? REASON_1 : REASON_IGNORED,
            };
        });

        sut.flush();

        expect(fileStore.write.mock.calls[1][0]).toMatchSnapshot(
            "After reconcile",
        );
    });
});
