import express from 'express';
import {JunkmailShredderService} from "./services/JunkmailShredderService";

const api = express();
const port = 3000;

// Need a fresh instance of the service for each request because tokens can expire
// Could refactor this later to resolve this issue
function getService() {
    return new JunkmailShredderService();
}

api.get('/onDemand', async (_, res) => {
    console.log('On demand run triggered');
    getService().sweepJunkEmails();
    return res.status(200).send(`Junk email cleanup complete - ${new Date().toISOString()}`);
});

api.get('/deleteIgnoredMessages', async (_, res) => {
    console.log('Delete ignored messages triggered');
    await (getService().deleteIgnoredMessages());
    return res.status(200).send(`Ignored messages deleted - ${new Date().toISOString()}`);
});

api.get('/summary', async (_, res) => {
    return res.status(200).send(getService().getReport());
});

api.get('/summary/ignored', async (req, res) => {
    const service = getService();
    const minTotal = req.query.minTotal as string;
    return res.status(200).send(service.searchReport(service.getReport().ignored, minTotal ? Number.parseInt(minTotal) : undefined, req.query.searchTerm as string))
});

api.get('/summary/deleted', async (req, res) => {
    const service = getService();
    const minTotal = req.query.minTotal as string;
    return res.status(200).send(service.searchReport(service.getReport().deleted, minTotal ? Number.parseInt(minTotal) : undefined, req.query.searchTerm as string))
});

api.listen(port, () => console.log(`Api running on port http://localhost:${port}`));
