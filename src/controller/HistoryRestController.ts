import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router } from "express";
import { HistoryService } from "../services/HistoryService";
import { buildListResource } from "../resource/ListResource";

export class HistoryRestController extends BaseRestController {
    protected rootRoute: string = "/history";

    constructor(private service: HistoryService) {
        super();
    }

    registerRoutes(router: Router): void {
        router.get("/", this.getHistory());
        router.get("/ignored", this.getHistory("ignored"));
        router.get("/deleted", this.getHistory("deleted"));
        router.get(`/:id`, this.getById);
    }

    getById: RequestHandler = async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Missing id");
        }

        const resource = await this.service.getById(Number(id));

        if (!resource) {
            return res.status(404).send("History not found");
        }

        return res.json(resource);
    };

    getHistory: (route?: "ignored" | "deleted") => RequestHandler =
        (reportType) => async (req, res) => {
            const service = this.service;
            const { searchTerm } = req.query;
            return res.status(200).send(
                buildListResource(
                    await service.getAll({
                        searchTerm: searchTerm as string | undefined,
                        wasShredded: !reportType
                            ? undefined
                            : reportType === "deleted",
                    }),
                ),
            );
        };
}
