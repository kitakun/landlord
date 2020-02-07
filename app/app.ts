import express = require('express');

import * as contrlService from './services/ControllerService';
import * as databaseAccess from './db/index';
import setService from './services/SettingsService';

const ultraApp: express.Application = express();
const port = process.env.PORT || 3000;

setService.startWatching();

contrlService.singletoneService.Init(ultraApp);
databaseAccess
    .module
    .validateConnection()
    .then(_ => ultraApp.listen(port, () => console.log(`[app.ts] Example app listening on port ${port}!`)))
    .catch(err => console.error(err));