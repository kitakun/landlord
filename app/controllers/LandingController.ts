import express from 'express';

import IInjectableController from './InjectableController';
import landingService from '../services/LandingService';

import { module as dbAccess } from '../db/index';
import landingRepo from '../db/Repositories/LandingEntityRepo';

import { ILandingEntity } from '../models/DatabaseTypes';

export default class LandingController implements IInjectableController {

    public Inject(ultraApp: express.Application): void {
        dbAccess
            .hasTables()
            .then(hasTables => {
                if (hasTables) {
                    // Start all existing landings on startup
                    landingRepo
                        .loadAllLandingsWithPortsAsync()
                        .then((allLandings: { rows: ILandingEntity[] }) =>
                            allLandings.rows.forEach(landingEntity =>
                                landingService.InjectSingleSpace(landingEntity.Name, landingEntity.WebPort)));
                }
            });
    }

    private InjectTestMustache(): void {
        // this._ultraApp!.get('/landing', (req, res) => {
        //     const view = {
        //         title: "Joe",
        //         calc: () => 2 + 4
        //     };

        //     const template = "{{title}} spends {{calc}}";

        //     var html = mustache.render(template, view);

        //     res.send(html);
        // });
    }
}