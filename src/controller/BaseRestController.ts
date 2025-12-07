import { Router } from "express";
import { JunkmailShredderService } from "../services/JunkmailShredderService";

export abstract class BaseRestController {
    protected constructor(private readonly route: string) {}

    public getRoute(): string {
        return this.route;
    }

    public abstract registerRoutes(router: Router): void;

    // Need a fresh instance of the service for each request because tokens can expire
    // Could refactor this later to resolve this issue
    protected getService() {
        return new JunkmailShredderService();
    }
}
