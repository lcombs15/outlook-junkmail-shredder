import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router } from "express";
import { EmailPersistenceService } from "../services/db/EmailPersistenceService";
import { AuthenticationService } from "../services/AuthenticationService";

export class HealthRestController extends BaseRestController {
    protected rootRoute = "/healthcheck";

    constructor(
        private emailPersistenceService: EmailPersistenceService,
        private authService: AuthenticationService,
    ) {
        super();
    }

    registerRoutes(router: Router): void {
        router.get("/", this.healthCheck);
    }

    healthCheck: RequestHandler = async (_, res) => {
        this.tryOperation(
            this.authService.getAccessToken(),
            "Service is unable to authenticate",
        );
        this.tryOperation(
            // Silly search term to make sure the result set isn't large
            this.emailPersistenceService.find({ searchTerm: "xyz" }),
            "Database is not available",
        );

        return res.status(202).send("Junkmail service running.");
    };

    private tryOperation =
        (operation: Promise<unknown>, errorMessage: string): RequestHandler =>
        async (_, res) => {
            try {
                await operation;
            } catch (error) {
                return res.status(503).send(errorMessage);
            }
        };
}
