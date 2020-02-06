import express = require('express');

import IInjectableController from './InjectableController';
import dbCreator from '../db/createTables';

export default class UltraController implements IInjectableController {
    public Inject(app: express.Application): void {
        //GET home route
        app.get('/ultra/createdb', (req, res) => {
            const dbCreatorInstance = new dbCreator();
            dbCreatorInstance
                .CreateTables()
                .then(() => res.send('Success'))
                .catch(err => res.send(err?.message));
        });
    }
}