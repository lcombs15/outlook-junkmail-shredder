import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router } from "express";
import { JunkmailShredderService } from "../services/JunkmailShredderService";

export class HealthRestController extends BaseRestController {
    protected rootRoute = "/healthcheck";

    constructor(private service: JunkmailShredderService) {
        super();
    }

    registerRoutes(router: Router): void {
        router.get("/", this.healthCheck);
    }

    healthCheck: RequestHandler = async (_, res) => {
        await this.service.searchRecords();
        return res.status(202).send();
    };
}
