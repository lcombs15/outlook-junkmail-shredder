import { EnvironmentService } from "../EnvironmentService";
import { mock, MockProxy } from "jest-mock-extended";
import { DatabaseService } from "./DatabaseService";
import { EmailPersistenceService } from "./EmailPersistenceService";
import { Email } from "../../entity/db/Email";

describe("EmailPersistenceService", () => {
    let environmentService: MockProxy<EnvironmentService> =
        mock<EnvironmentService>();

    let service: EmailPersistenceService;

    beforeEach(() => {
        environmentService.getValue.mockReturnValue(":memory:");

        service = new EmailPersistenceService(
            new DatabaseService(environmentService),
        );
    });

    it("Can persist a single record and retrieve it", async () => {
        const persisted = await service.create([
            {
                send_date: "2024-01-10",
                shredded_reason: "I am not buying",
                from_address: "test@example.com",
                was_shredded: 1,
            },
        ]);

        // A single value list = [1] where [X] and X = the id of the new record
        expect(persisted).toHaveLength(1);
        expect(persisted[0]).toBe(1);

        const persistedRecord = await service.getById(1);
        expect(persistedRecord?.send_date).toBe("2024-01-10");
        expect(persistedRecord?.shredded_reason).toBe("I am not buying");
        expect(persistedRecord?.from_address).toBe("test@example.com");
        expect(persistedRecord?.was_shredded).toBe(1);
        expect(persistedRecord?.id).toBe(1);
        expect(persistedRecord?.created_at).toBeTruthy();
        expect(persistedRecord?.updated_at).toBeTruthy();
    });

    it("Should ignore duplicate records", async () => {
        const createMe: Email.Create = {
            send_date: "2024-01-10",
            shredded_reason: "I am not buying",
            from_address: "test@example.com",
            was_shredded: 1,
        };

        await service.create([createMe, createMe]);
        await service.create([createMe, createMe]);

        const allData = await service.find();
        expect(allData.length).toEqual(1);
    });

    describe("Find", () => {
        beforeEach(async () => {
            await service.create([
                {
                    send_date: "2024-01-10",
                    shredded_reason: "I am not buying",
                    from_address: "shred@example.com",
                    was_shredded: 1,
                },
                {
                    send_date: "2024-01-09",
                    shredded_reason: "I am not buying",
                    from_address: "shreddd@example.com",
                    was_shredded: 1,
                },
                {
                    send_date: "2024-01-10",
                    shredded_reason: "I am not buying",
                    from_address: "okay@example.com",
                    was_shredded: 0,
                },
                {
                    send_date: "2024-01-10",
                    shredded_reason: "I am not buying",
                    from_address: "okay+too@example.com",
                    was_shredded: 0,
                },
            ]);
        });

        [
            {
                filter: undefined,
                testCase: "find all",
                expectedIds: [1, 2, 3, 4],
            },
            {
                filter: { shredded: true },
                testCase: "shredded",
                expectedIds: [1, 2],
            },
            {
                filter: { shredded: false },
                testCase: "not shredded",
                expectedIds: [3, 4],
            },
            {
                filter: { searchTerm: "shred" },
                testCase: "search term",
                expectedIds: [1, 2],
            },
            {
                filter: { searchTerm: "shredd", shredded: true },
                testCase: "search term and shredded",
                expectedIds: [2],
            },
            {
                filter: { searchTerm: "shredd", shredded: false },
                testCase: "search term and not shredded",
                expectedIds: [],
            },
        ].forEach((param) => {
            it(`should: ${param.testCase}`, async () => {
                const result = await service.find(param.filter);

                expect(result.length).toEqual(param.expectedIds.length);
                expect(result.map((row) => row.id)).toEqual(param.expectedIds);
            });
        });
    });
});
