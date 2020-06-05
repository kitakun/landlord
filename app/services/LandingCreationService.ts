// System
import fs from 'fs';
import path from 'path';
// Components
import { checkFileExists, mkdirAsync } from '../utils';
// Database
import landingRepository from '../db/Repositories/LandingEntityRepo';

export default class LandingCreationService {

    static async createDirectory(name: string, port?: number): Promise<any> {
        const dirPath = path.join(__dirname, `../content/${name}`);

        const isDirExists = await checkFileExists(dirPath);
        if (!isDirExists) {
            const creationDirError = await mkdirAsync(dirPath);
            if (creationDirError) {
                throw creationDirError;
            }
        }

        return landingRepository.createNewSpace({
            Name: name,
            RunAtStartup: true,
            WebPort: port || 3005
        });
    }
}