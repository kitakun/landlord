import express from 'express';
// Components
import IInjectableController from './base/InjectableController';
import landingService, { getContentRoot } from '../services/LandingService';
// Database
import { module as dbAccess } from '../db/index';
import landingRepo from '../db/Repositories/LandingEntityRepo';
// Utils
import { checkFileExists } from '../utils/fsPromise';

/**
 * Initial landing setup
 * At startup, load all existing spaces and turn them on if we need to
 */
export default class LandingController implements IInjectableController {

    public async Inject(ultraApp: express.Application): Promise<void> {
        const hasTables = await dbAccess.hasTables();
        if (hasTables) {
            // Start all existing spaces
            const allLandings = await landingRepo.loadAllLandingsWithPortsAsync();
            for (const landingEntity of allLandings.rows) {
                try {
                    const landingNamespace = landingEntity.Name;
                    const isLandingContentFolderExists = await checkFileExists(getContentRoot(landingNamespace))
                    if (isLandingContentFolderExists) {
                        landingService.InjectSingleSpace(landingNamespace, landingEntity.WebPort);
                    } else {
                        console.warn(`For namespace=\'${landingNamespace}\' missed content folder`);
                    }
                } catch (err) {
                    console.log('catched');
                    console.error(err);
                }
            }
        }
    }
}