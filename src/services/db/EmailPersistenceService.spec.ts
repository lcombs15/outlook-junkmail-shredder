import { EnvironmentService } from "../EnvironmentService";
import { mock, MockProxy } from "jest-mock-extended";
import { DatabaseService } from "./DatabaseService";
import { EmailPersistenceService } from "./EmailPersistenceService";
import { Email } from "../../entity/db/Email";

describe("EmailPersistenceService", () => {
    let environmentService: MockProxy<EnvironmentService> =
        mock<EnvironmentService>();

    let db: DatabaseService;

    let service: EmailPersistenceService;

    beforeEach(() => {
        environmentService.getValue.mockReturnValue(":memory:");

        db = new DatabaseService(environmentService);

        service = new EmailPersistenceService(db);
    });

    afterEach(() => {
        db.close();
    });

    it("Can persist a single record and retrieve it", async () => {
        const persisted = await service.create([
            {
                send_date: "2024-01-10",
                shredded_reason: "I am not buying",
                from_address: "test@example.com",
                subject_line: "hello subject line",
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
        expect(persistedRecord?.subject_line).toBe("hello subject line");
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
                    subject_line: "hello world",
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
                expectedIds: [4, 3, 2, 1],
            },
            {
                filter: { shredded: true },
                testCase: "shredded",
                expectedIds: [2, 1],
            },
            {
                filter: { shredded: false },
                testCase: "not shredded",
                expectedIds: [4, 3],
            },
            {
                filter: { searchTerm: "shred" },
                testCase: "search term",
                expectedIds: [2, 1],
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

        it("Should count", async () => {
            const result = await service.getCount();

            expect(result.count).toBe(4)
        });
    });

    describe("Subject line", () => {
        it("should truncate large values", async () => {
            const inputEntity: Email.Create = {
                send_date: "2024-01-10",
                shredded_reason: "I am not buying",
                from_address: "shred@example.com",
                subject_line: new Array(400).fill("hello").join(""),
                was_shredded: 1,
            };

            const result = await service.create([inputEntity]);
            expect(inputEntity.subject_line?.length).toBeGreaterThan(500);

            const persisted = await service.getById(result[0]);
            expect(persisted?.subject_line).toBeTruthy();
            expect(persisted?.subject_line?.length).toBeGreaterThan(500);
        });
    });

    it("Should mark as shredded when requested", async () => {
        const persisted = await service.create([
            {
                send_date: "2024-01-10",
                shredded_reason: "I am not buying",
                from_address: "test@example.com",
                subject_line: "hello subject line",
                was_shredded: 0,
            },
        ]);
        await service.markAsShredded(persisted[0], "I said so");

        const shredded = await service.getById(persisted[0]);
        expect(shredded?.was_shredded).toBe(1);
        expect(shredded?.shredded_reason).toBe("I said so");
    });

});
