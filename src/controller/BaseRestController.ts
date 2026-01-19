import { Router } from "express";

export abstract class BaseRestController {
    protected abstract rootRoute: string;

    public getRoute(): string {
        return this.rootRoute;
    }

    public abstract registerRoutes(router: Router): void;
}
