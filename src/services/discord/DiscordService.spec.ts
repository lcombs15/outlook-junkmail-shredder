import {DiscordService} from "./DiscordService";
import {EnvironmentService} from "../EnvironmentService";
import {mock, MockProxy} from 'jest-mock-extended';
import {EnvironmentVariableName} from "../../entity/EnvironmentVariable";

describe('DiscordService', () => {
    let service: DiscordService;

    let http = jest.fn();

    let environmentService: MockProxy<EnvironmentService> = mock<EnvironmentService>();

    const expectedUrl = "mydiscord.com/the-server/stuff"

    beforeEach(() => {
        http.mockClear();

        environmentService.getValueFromFile
            .calledWith(EnvironmentVariableName.DISCORD_URL_FILE)
            .mockReturnValue(expectedUrl);

        service = new DiscordService(environmentService, http);
    })

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

    it('should split up large number of embeds to multiple messages', async () => {
        http.mockReturnValue({
            ok: true
        })

        const myMockEmbed = {hello: "world"}

        await service.sendMessage('msg 2 discord trunc', new Array(21).fill(myMockEmbed));

        const expectNumberEmbeds = ({callNumber, expectedNumber}: { callNumber: number, expectedNumber: number }) => {
            const [url, request] = http.mock.calls[callNumber];

            expect(url).toBe(expectedUrl);
            const {embeds} = JSON.parse(request.body)
            expect(embeds).toHaveLength(expectedNumber);
        };

        expectNumberEmbeds({callNumber: 0, expectedNumber: 10});
        expectNumberEmbeds({callNumber: 1, expectedNumber: 10});
        expectNumberEmbeds({callNumber: 2, expectedNumber: 1});
        expect(http.mock.calls).toHaveLength(3);
    });

    it('should not make an http call without a URL', async () => {
        environmentService.getValueFromFile
            .calledWith(EnvironmentVariableName.DISCORD_URL_FILE)
            .mockReturnValue(null);

        service = new DiscordService(environmentService, http);

        await service.sendMessage('something here', new Array(5).fill({msg: "we ride and never worry about the fall"}));

        expect(http).toHaveBeenCalledTimes(0);
    });

    it('should not make an http call if there are no embeds', async () => {
        await service.sendMessage('something here', []);

        expect(http).toHaveBeenCalledTimes(0);
    });
})
