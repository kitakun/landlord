// Packages
import express = require('express');
// Components & Database
import * as contrlService from './services/ControllerService';
import * as databaseAccess from './db/index';
import setService from './services/SettingsService';

// root app
const ultraApp: express.Application = express();
const port = process.env.PORT || 3000;

// services
setService.startWatching();

// run saved spaces
contrlService.singletoneService.Init(ultraApp);

// check database and run app
databaseAccess
    .module
    .validateConnection()
    .then(_ => ultraApp.listen(port, () => console.log(`[app.ts] Example app listening on port ${port}!`)))
    .catch(err => console.error(err));