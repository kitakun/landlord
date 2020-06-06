import express from 'express';
// Components
import IInjectableController from './InjectableController';
import landingService from '../services/LandingService';
// Database
import { module as dbAccess } from '../db/index';
import landingRepo from '../db/Repositories/LandingEntityRepo';
// Models
import { ILandingEntity } from '../models/DatabaseTypes';

interface LandingLoadedData {
    rows: ILandingEntity[]
}

/**
 * Initial landing setup
 * At startup, load all existing spaces and turn them on if we need to
 */
export default class LandingController implements IInjectableController {

    public Inject(ultraApp: express.Application): void {
        dbAccess
            .hasTables()
            .then(hasTables => {
                if (hasTables) {
                    // Start all existing spaces
                    landingRepo
                        .loadAllLandingsWithPortsAsync()
                        .then((allLandings) => {
                            allLandings.rows.forEach(landingEntity => {
                                try {
                                    landingService.InjectSingleSpace(landingEntity.Name, landingEntity.WebPort);
                                } catch (err) {
                                    console.error(err);
                                }
                            });
                        });
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