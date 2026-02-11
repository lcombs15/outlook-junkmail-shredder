import { DataSummaryService } from "./DataSummaryService";
import { mock, MockProxy } from "jest-mock-extended";
import { buildEmail } from "../tools/buildEmail";
import { Outlook } from "../entity/outlook";
import { JunkEvaluation, JunkService } from "./junk/JunkService";
import { EmailPersistenceService } from "./db/EmailPersistenceService";
import { DiscordService } from "./discord/DiscordService";

describe("DataSummaryService", () => {
    let sut: DataSummaryService;
    let persistenceService: MockProxy<EmailPersistenceService>;
    let discordService: MockProxy<DiscordService>;
    let junkService: MockProxy<JunkService>;

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
        junkService = mock();
        discordService = mock();
        sut = new DataSummaryService(
            persistenceService,
            junkService,
            discordService,
        );
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

    it("should reconcile ignored messages", async () => {
        junkService.evaluate
            .mockReturnValueOnce({
                isJunk: true,
                reason: "crazy subject line",
            })
            .mockReturnValueOnce({
                isJunk: false,
                reason: "ignored",
            });

        persistenceService.find.mockReturnValue(
            Promise.resolve([
                {
                    id: 456,
                    send_date: "2024-01-10",
                    shredded_reason: "I am not buying",
                    from_address: "test@example.com",
                    subject_line: "hello subject line",
                    was_shredded: 0,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: 789,
                    send_date: "2024-01-10",
                    shredded_reason: "I am not buying",
                    from_address: "test@example.com",
                    subject_line: "hello subject line",
                    was_shredded: 0,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]),
        );

        await sut.reconcile();

        expect(persistenceService.markAsShredded).toHaveBeenCalledTimes(1);
        expect(persistenceService.markAsShredded.mock.calls[0]).toEqual([
            456,
            "crazy subject line",
        ]);

        expect(discordService.sendMessage).toHaveBeenCalledTimes(1);
        expect(discordService.sendMessage.mock.calls[0]).toMatchSnapshot();
    });
});
