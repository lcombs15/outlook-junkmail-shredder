import {DiscordNotificationService} from "./DiscordNotifcationService";
import {EnvironmentService} from "./EnvironmentService";
import {mock, MockProxy} from 'jest-mock-extended';
import Email from "../entity/email";
import {JunkEvaluation} from "./junk/JunkService";
import {EnvironmentVariableName} from "../entity/EnvironmentVariable";

const mockEvaluation: [Email, JunkEvaluation] = [
    {
        id: 'aaa-bbb-ccc',
        receivedDateTime: '2025 Mar 7',
        toRecipients: [{
            emailAddress: {
                name: 'Steve Jobs',
                address: 'steve@apple.com'
            }
        }],
        bccRecipients: [],
        ccRecipients: [],
        subject: '',
        from: {
            emailAddress: {
                name: 'Post Master From',
                address: 'post+from@postmaster.com'
            }
        },
        body: {
            content: '<html></html>',
            contentType: 'html'
        },
        sender: {
            emailAddress: {
                name: 'Post Master Sender',
                address: 'post+sender@postmaster.com'
            }
        }
    },
    {
        isJunk: false,
        reason: 'test data is not junk!'
    }
]

describe('DiscordNotificationService', () => {
    let service: DiscordNotificationService;

    let http = jest.fn();

    let environmentService: MockProxy<EnvironmentService> = mock<EnvironmentService>();

    const expectedUrl = "mydiscord.com/the-server/stuff"

    beforeEach(() => {
        http.mockClear();

        environmentService.getValueFromFile
            .calledWith(EnvironmentVariableName.DISCORD_URL_FILE)
            .mockReturnValue(expectedUrl);

        service = new DiscordNotificationService(environmentService, http);
    })

    it('should send a message to discord', async () => {
        http.mockReturnValue({
            ok: true
        })

        await service.sendEmailMessage('msg 2 discord', [mockEvaluation]);

        const [url, body] = http.mock.calls[0];

        expect(url).toBe(expectedUrl);
        expect(body).toMatchSnapshot()
    });

    it('should truncate long embeds', async () => {
        http.mockReturnValue({
            ok: true
        })

        const myIncludedData = new Array(2000).fill('abc').join();

        await service.sendMessage('msg 2 discord trunc', [{myIncludedData}]);

        const [url, request] = http.mock.calls[0];

        expect(url).toBe(expectedUrl);
        const {embeds} = JSON.parse(request.body)
        expect(embeds).toHaveLength(1);
        expect(embeds[0].fields).toHaveLength(1);

        const mySingleEmbed = embeds[0].fields[0];
        expect(mySingleEmbed.name).toBe('myIncludedData');
        expect(mySingleEmbed.value).toHaveLength(1024);
        expect(myIncludedData.length).toBeGreaterThan(1024);
    });
})
