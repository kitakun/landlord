import express = require('express');

import IInjectableController from "./InjectableController";

// Root server index page
export default class HomeController implements IInjectableController {

    public Inject(app: express.Application): void {
        //GET home route
        app.get('/', (req, res) => {
            res.send('Hello World');
        });
        
    }
}