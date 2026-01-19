import { EnvironmentService } from "../EnvironmentService";
import { mock, MockProxy } from "jest-mock-extended";
import { DatabaseService } from "./DatabaseService";
import { EmailPersistenceService } from "./EmailPersistenceService";

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
});
