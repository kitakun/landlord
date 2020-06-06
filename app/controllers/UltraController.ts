import fs from 'fs';
import path from 'path';
import express = require('express');
// Components
import IInjectableController from './InjectableController';
import landingService from '../services/LandingService';
import { stack } from '../utils/landingStack';
import { AdminExisgintSpace } from '../models/Admin.model';
import { ultraAdminMiddleware, getFilesAsync, notFoundMiddleware, errorMiddleware } from '../utils';
import LandingCreationService from '../services/LandingCreationService';
// Database
import landingRepository from '../db/Repositories/LandingEntityRepo';
import dbCreator from '../db/createTables';

/**
 * Ultra admin space
 * Control under all spaces, enabling, disabling, etc
 */
export default class UltraController implements IInjectableController {

    public Inject(app: express.Application): void {

        app.use(ultraAdminMiddleware);
        app.use(express.json());

        const namespaceRootFoldier = path.join(__dirname, `../content/admin`);

        getFilesAsync(namespaceRootFoldier)
            .then(allExistingFiles => {

                const haveIndexFile = allExistingFiles.some(f => f.indexOf('index.html') >= 0);

                // GET home route
                app.get('/ultra', (_, res, next: (errd?: any) => void) => {
                    if (haveIndexFile) {
                        res.sendfile(path.join(namespaceRootFoldier, 'index.html'));
                    } else {
                        res.send('index.html is not implemented yet');
                    }
                });

                // server all static content
                allExistingFiles
                    .filter(f => f.indexOf('index.html') < 0)
                    .forEach(resourceFile => {
                        const relativePath = resourceFile.slice(resourceFile.indexOf('admin') + 'admin'.length);
                        const contentUrl = path.join('/ultra/admin', relativePath).replace(/\\/g, "/");
                        app.get(contentUrl, (_, res) => res.sendfile(resourceFile));
                    });

                this.SyncInject(app);
            })
            .catch(err => console.error(err));
    }

    private SyncInject(app: express.Application): void {

        // POST create db from zero
        app.post('/ultra/createdb', (_, res) => {
            const dbCreatorInstance = new dbCreator();
            dbCreatorInstance
                .CreateTables()
                .then(() => res.send('Success'))
                .catch(err => res.status(405).send(err?.message));
        });

        // POST start existing landing
        app.post('/ultra/startlanding/:name', (req, res) => {
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
                                    res.status(405).send(`${landingName} already runned!`);
                                }
                            } else {
                                res.status(405).send(`${landingName} has ${loadedPort} and he treated as incorrect!`);
                            }
                        } else {
                            res.status(405).send(`${landingName} not found in db!`);
                        }
                    })
                    .catch(err => res.status(405).send(err.message));
            }
        });

        // POST stop existing landing
        app.post('/ultra/stoplanding/:name', (req, res) => {
            const landingName = req.params.name;
            if (!landingName) {
                res
                    .status(405)
                    .send('Name is missed');
            } else {
                if (landingService.ShutdownLanding(landingName)) {
                    const responseText = `Landing ${landingName} stopped`;
                    console.log(responseText);
                    res.send(responseText);
                } else {
                    res
                        .status(405)
                        .send(`Landing ${landingName} not working, skip`);
                }
            }
        });

        // POST get all existing landings with statuses
        app.post('/ultra/getlist', (_, res) => {
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
        });

        app.post('/ultra/createnew', (req, res) => {
            const recievedData = req.body as { name: string, port?: number };
            if (!recievedData.name || recievedData.name.length <= 3) {
                res.status(405).send({ message: 'Please choose better name' });
            } else if (recievedData.port && recievedData.port < 998) {
                res.status(405).send({ message: 'Please choose better port' });
            } else {

                LandingCreationService
                    .createDirectory(recievedData.name, recievedData.port)
                    .then((result) => {
                        res.send('ok');
                    })
                    .catch((getErr) => res.status(500).send(getErr));
            }
        });

        app.get('*', notFoundMiddleware);
        app.post('*', notFoundMiddleware);

        app.use(errorMiddleware);
    }
}