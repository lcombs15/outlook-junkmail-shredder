import { Router } from "express";
import { JunkmailShredderService } from "../services/JunkmailShredderService";

export abstract class BaseRestController {
    protected abstract rootRoute: string;
    protected service: JunkmailShredderService = new JunkmailShredderService();

    public getRoute(): string {
        return this.rootRoute;
    }

    public abstract registerRoutes(router: Router): void;
}
