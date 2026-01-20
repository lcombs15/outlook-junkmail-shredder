import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router } from "express";

export class HealthRestController extends BaseRestController {
    protected rootRoute = "/healthcheck";

    registerRoutes(router: Router): void {
        router.get("/", this.healthCheck);
    }

    healthCheck: RequestHandler = async (_, res) => {
        this.service.getReport();
        return res.status(202).send();
    };
}
