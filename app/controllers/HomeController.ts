import express = require('express');
// Components
import IInjectableController from "./InjectableController";

/**
 * Root server index page
 */
export default class HomeController implements IInjectableController {
    static startedAt: number = 0;

    public Inject(app: express.Application): void {
        HomeController.startedAt = Date.now();

        //GET home route
        app.get('/', (req, res) => res.json({
            aliveTime: Date.now() - HomeController.startedAt
        }));
    }
}