import express, { Request, Response } from 'express';
// Components
import IInjectableController from './base/InjectableController';

/**
 * Root server index page
 */
export default class HomeController implements IInjectableController {
    static startedAt: number = 0;

    public Inject(app: express.Application): void {
        HomeController.startedAt = Date.now();

        //GET home route
        app.get('/', this.getRoot.bind(this));
    }

    private getRoot(req: Request, res: Response) {
        res.json({
            aliveTime: Date.now() - HomeController.startedAt
        })
    }
}