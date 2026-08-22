import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router, Request, Response } from "express";
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
        router.delete(`/:id`, this.deleteById);
    }

    private getIdFromRequest(req: Request, res: Response): number | undefined {
        const { id } = req.params;

        if (!id) {
            res.status(400).send("History ID is required.");
            return;
        }

        return Number(id);
    }

    getById: RequestHandler = async (req, res) => {
        const id = this.getIdFromRequest(req, res);

        const resource = await this.service.getById(Number(id));

        if (!resource) {
            return res.status(404).send(`Record not found: ${id}`);
        }

        return res.json(resource);
    };

    deleteById: RequestHandler = async (req, res) => {
        const id = this.getIdFromRequest(req, res);

        if (!id) {
            return;
        }

        await this.service.deleteById(id);

        return res.status(204).send();
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
