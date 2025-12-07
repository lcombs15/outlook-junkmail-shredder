import { Router } from "express";
import { JunkmailShredderService } from "../services/JunkmailShredderService";

export abstract class BaseRestController {
    protected abstract rootRoute: string;

    public getRoute(): string {
        return this.rootRoute;
    }

    public abstract registerRoutes(router: Router): void;

    // Need a fresh instance of the service for each request because tokens can expire
    // Could refactor this later to resolve this issue
    protected getService() {
        return new JunkmailShredderService();
    }
}
