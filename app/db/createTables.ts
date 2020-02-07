import fs from 'fs';
import path from 'path';

import { module as db } from './index';

export default class CreatePostgresTables {
    public async CreateTables(): Promise<void> {

        if(await db.hasTables())
            throw new Error('Database already have tables!');

        const directoryPath = path.join(__dirname, '../../PsqlScripts/CreateTablesFromZero');

        var files = fs.readdirSync(directoryPath);

        files.forEach(async scriptFile => {
            const settingsBuffer = fs.readFileSync(path.join(directoryPath, scriptFile));
            const scriptBody = settingsBuffer.toString('utf8');

            await db.queryPromise(scriptBody, null);
        });
    }
}