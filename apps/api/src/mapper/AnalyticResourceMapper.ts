import { AnalyticCountResult } from "../services/AnalyticsService";
import { AnalyticCountResource } from "../resource/AnalyticCountResource";

export class AnalyticResourceMapper {
    toResource({
        month,
        total,
        year,
        shredded_total,
        ignored_total,
    }: AnalyticCountResult): AnalyticCountResource {
        return {
            ignoredTotal: ignored_total,
            shreddedTotal: shredded_total,
            total,
            period: new Intl.DateTimeFormat("en-US", {
                month: "short",
                year: "numeric",
            }).format(new Date(year, month)),
        };
    }
}
