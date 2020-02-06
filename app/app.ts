import express = require('express');

import * as contrlService from './services/ControllerService';
import * as databaseAccess from './db/index';

const app: express.Application = express();
const port = process.env.PORT || 3000;

contrlService.singletoneService.Init(app);
databaseAccess
    .module
    .validateConnection()
    .then(_ => app.listen(port, () => console.log(`Example app listening on port ${port}!`)))
    .catch(err => console.error(err));
