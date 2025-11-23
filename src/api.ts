import express from 'express';
import {JunkmailShredderService} from "./services/JunkmailShredderService";

const api = express();
const junkmailShredderService = new JunkmailShredderService();
const port = 3000;

api.get('/onDemand', async (_, res) => {
    console.log('On demand run triggered');
    junkmailShredderService.sweepJunkEmails();
    return res.status(200).send(`Junk email cleanup complete - ${new Date().toISOString()}`);
});

api.get('/deleteIgnoredMessages', async (_, res) => {
    console.log('Delete ignored messages triggered');
    await junkmailShredderService.deleteIgnoredMessages();
    return res.status(200).send(`Ignored messages deleted - ${new Date().toISOString()}`);
})

api.listen(port, () => console.log(`Api running on port http://localhost:${port}`));
