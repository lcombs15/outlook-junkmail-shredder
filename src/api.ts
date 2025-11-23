import express from 'express';
import {JunkmailShredderService} from "./services/JunkmailShredderService";

const api = express();
const junkmailShredderService = new JunkmailShredderService();
const port = 3000;

api.get('/ondemand', async (req, res) => {
    console.log('On demand run triggered');
    junkmailShredderService.sweepJunkEmails();
    return res.status(200).send(`Junk email cleanup complete - ${new Date().toISOString()}`);
});

api.listen(port, () => console.log(`Api running on port http://localhost:${port}`));
