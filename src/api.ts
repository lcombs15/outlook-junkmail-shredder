import express from "express";
import { BaseRestController } from "./controller/BaseRestController";
import { SummaryRestController } from "./controller/SummaryRestController";
import { OutlookRestController } from "./controller/OutlookRestController";
import { HealthRestController } from "./controller/HealthRestController";
import { JunkmailShredderService } from "./services/JunkmailShredderService";

const api = express();
const port = 3000;

const service = new JunkmailShredderService();

const controllers: Array<BaseRestController> = [
    SummaryRestController,
    OutlookRestController,
    HealthRestController,
].map((controller) => new controller(service));

controllers.forEach((controller) => {
    const router = express.Router();
    controller.registerRoutes(router);
    api.use(controller.getRoute(), router);
});

api.listen(port, () =>
    console.log(`Api running on port http://localhost:${port}`),
);
