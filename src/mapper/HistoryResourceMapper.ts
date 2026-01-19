import { Email } from "../entity/db/Email";
import { HistoryResource } from "../resource/HistoryResource";

export class HistoryResourceMapper {
    toResource(entity: Email.Model): HistoryResource {
        return {
            id: entity.id,
            fromEmail: entity.from_address,
            wasShredded: !!entity.was_shredded,
            shreddedReason: entity.shredded_reason,
            receiveAt: entity.send_date,
        };
    }
}
