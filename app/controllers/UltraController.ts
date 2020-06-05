import express = require('express');
// Components
import IInjectableController from './InjectableController';
import settings from '../services/SettingsService';
import landingService from '../services/LandingService';
import { stack } from '../utils/landingStack';
import { AdminExisgintSpace } from '../models/Admin.model';
// Database
import landingRepository from '../db/Repositories/LandingEntityRepo';
import dbCreator from '../db/createTables';

/**
 * Ultra admin space
 * Control under all spaces, enabling, disabling, etc
 */
export default class UltraController implements IInjectableController {

    public Inject(app: express.Application): void {

        //GET home route
        app.get('/ultra', (req, res) => this._secureAction(req, res, () => {
            res.send('index.html is not implemented yet');
        }));

        //GET create db from zero
        app.get('/ultra/createdb', (req, res) => this._secureAction(req, res, () => {
            const dbCreatorInstance = new dbCreator();
            dbCreatorInstance
                .CreateTables()
                .then(() => res.send('Success'))
                .catch(err => res.send(err?.message));
        }));

        //GET start existing landing
        app.get('/ultra/startlanding/:name', (req, res) => this._secureAction(req, res, () => {
            const landingName = req.params.name;
            if (!landingName) {
                res
                    .status(405)
                    .send('Name is missed');
            } else {
                landingRepository.loadLandingPortByNameAsync(landingName)
                    .then((result) => {
                        if (result.rows.length > 0) {
                            const loadedPort = result.rows[0].Port;
                            if (loadedPort) {
                                if (!landingService.InjectSingleSpace(landingName, loadedPort, () => {
                                    res.send(`${landingName} runned at ${loadedPort} port!`)
                                })) {
                                    res.send(`${landingName} already runned!`);
                                }
                            } else {
                                res.send(`${landingName} has ${loadedPort} and he treated as incorrect!`);
                            }
                        } else {
                            res.send(`${landingName} not found in db!`);
                        }
                    })
                    .catch(err => res.send(err.message));
            }
        }));

        //GET stop existing landing
        app.get('/ultra/stoplanding/:name', (req, res) => this._secureAction(req, res, () => {
            const landingName = req.params.name;
            if (!landingName) {
                res
                    .status(405)
                    .send('Name is missed');
            } else {
                if (landingService.ShutdownLanding(landingName)) {
                    const responseText = `Landing ${landingName} stopped`;
                    console.log(responseText);
                    res.send(`responseText`);
                } else {
                    res
                        .status(405)
                        .send(`Landing ${landingName} not working, skip`);
                }
            }
        }));

        app.post('/ultra/getlist', (req, res) => this._secureAction(req, res, () => {
            landingRepository
                .loadAllLandingsWithPortsAsync()
                .then(resp => {
                    const frontendData = resp.rows.map(row => {
                        const anyRow = row as AdminExisgintSpace;

                        anyRow.isEnabled = !!stack.inWork.find(f => f.namespace === row.Name);

                        return anyRow
                    });

                    return res.json(frontendData);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500)
                        .json({ message: 'error while loading loadAllLandingsWithPortsAsync' });
                });
        }));
    }

    private _secureAction(req: express.Request, res: express.Response, action: () => void): void {
        const currentIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const host = req.get('host');
        const settingsData = settings.getSettings();

        const ultraDomain = settingsData.UltraDomain || '';
        const trustedIPs = settingsData.TrustedIPs || [];

        if (trustedIPs.findIndex(f => f == currentIp) >= 0
            && ultraDomain == host) {
            action();
        } else {
            res
                .status(404)
                .send('Not found');
        }
    }
}