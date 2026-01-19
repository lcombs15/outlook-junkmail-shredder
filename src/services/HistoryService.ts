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

    async getAll(query: {
        searchTerm?: string;
        wasShredded?: boolean;
    }): Promise<HistoryResource[]> {
        const entities = await this.emailService.find({
            shredded: query.wasShredded,
            searchTerm: query.searchTerm,
        });
        return entities.map(this.mapper.toResource);
    }
}
