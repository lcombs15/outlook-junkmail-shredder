import express from "express";
import { BaseRestController } from "./controller/BaseRestController";
import { SummaryRestController } from "./controller/SummaryRestController";
import { OutlookRestController } from "./controller/OutlookRestController";
import { HealthRestController } from "./controller/HealthRestController";

const api = express();
const port = 3000;

const controllers: Array<BaseRestController> = [
    new SummaryRestController(),
    new OutlookRestController(),
    new HealthRestController(),
];

controllers.forEach((controller) => {
    const router = express.Router();
    controller.registerRoutes(router);
    api.use(controller.getRoute(), router);
});

api.listen(port, () =>
    console.log(`Api running on port http://localhost:${port}`),
);
