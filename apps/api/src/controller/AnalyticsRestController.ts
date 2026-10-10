import { BaseRestController } from "./BaseRestController";
import { Request, RequestHandler, Router } from "express";
import { AnalyticsService } from "../services/AnalyticsService";

export class AnalyticsRestController extends BaseRestController {
    protected rootRoute: string = "/analytics";

    constructor(private service: AnalyticsService) {
        super();
    }

    registerRoutes(router: Router): void {
        router.get("/", this.get);
    }

    get: RequestHandler = async (
        req: Request<
            any,
            any,
            any,
            {
                beforeDate?: string;
                afterDate?: string;
            }
        >,
        res,
    ) => {
        const { afterDate, beforeDate } = req.query;

        return res.status(200).send(
            await this.service.getCounts({
                afterDate: this.getDateOrUndefined(afterDate),
                beforeDate: this.getDateOrUndefined(beforeDate),
            }),
        );
    };
}
