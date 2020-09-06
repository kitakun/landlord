// Packages
import express from 'express';
import cors from 'cors';
// Components & Database
import { singletoneService } from './services/ControllerService';
import { module as databaseAccess } from './db/index';
import setService from './services/SettingsService';

// root app
const ultraApp: express.Application = express();
const port = process.env.PORT || 3000;
ultraApp.use(cors());

// services
setService.startWatching();

// run saved spaces
singletoneService.Init(ultraApp);

// check database and run app
databaseAccess
    .validateConnection()
    .then(_ => ultraApp.listen(port, () => console.log(`[app.ts] Example app listening on port ${port}!`)))
    .catch(err => console.error(err));