import { DiscordService } from "./DiscordService";
import { mock, MockProxy } from "jest-mock-extended";
import { Outlook } from "../../entity/outlook";
import { JunkEvaluation } from "../junk/JunkService";
import { DiscordEmailNotificationService } from "./DiscordEmailNotificationService";

const mockEvaluation: [Outlook.Email, JunkEvaluation] = [
    {
        id: "aaa-bbb-ccc",
        receivedDateTime: "2025 Mar 7",
        toRecipients: [
            {
                emailAddress: {
                    name: "Steve Jobs",
                    address: "steve@apple.com",
                },
            },
        ],
        bccRecipients: [],
        ccRecipients: [],
        subject: "here is my subject",
        from: {
            emailAddress: {
                name: "Post Master From",
                address: "post+from@postmaster.com",
            },
        },
        body: {
            content: "<html></html>",
            contentType: "html",
        },
        sender: {
            emailAddress: {
                name: "Post Master Sender",
                address: "post+sender@postmaster.com",
            },
        },
    },
    {
        isJunk: false,
        reason: "test data is not junk!",
    },
];

describe("DiscordEmailNotificationService", () => {
    let service: DiscordEmailNotificationService;

    let http = jest.fn();

    let discordService: MockProxy<DiscordService> = mock<DiscordService>();

    beforeEach(() => {
        service = new DiscordEmailNotificationService(discordService);
    });

    it("should send a message to discord", async () => {
        http.mockReturnValue({
            ok: true,
        });

        await service.sendEmailMessage("msg 2 discord", [mockEvaluation]);

        expect(discordService.sendMessage).toHaveBeenCalledTimes(1);
        expect(discordService.sendMessage.mock.calls[0][0]).toBe(
            "msg 2 discord",
        );
        expect(discordService.sendMessage.mock.calls[0][1]).toMatchSnapshot();
    });
});
