import { HistoryResource } from "../resource/HistoryResource";
import { EmailPersistenceService } from "./db/EmailPersistenceService";
import { HistoryResourceMapper } from "../mapper/HistoryResourceMapper";

export class HistoryService {
    constructor(
        private readonly emailService: EmailPersistenceService,
        private readonly mapper: HistoryResourceMapper,
    ) {}

    async getById(id: number): Promise<HistoryResource | undefined> {
        const entity = await this.emailService.getById(id);

        if (entity) {
            return this.mapper.toResource(entity);
        }

        return;
    }

    async deleteById(id: number): Promise<void> {
        await this.emailService.deleteById(id);
    }

    async getAll(query: {
        searchTerm?: string;
        wasShredded?: boolean;
        afterDate?: Date;
    }): Promise<HistoryResource[]> {
        const entities = await this.emailService.find({
            shredded: query.wasShredded,
            searchTerm: query.searchTerm,
            afterDate: query.afterDate,
        });
        return entities.map(this.mapper.toResource);
    }
}
