import fs from 'fs';
import path from 'path';

import * as db from './index';

export default class CreatePostgresTables {
    public async CreateTables(): Promise<void> {

        const hasTableScriptPath = path.join(__dirname, '../../PsqlScripts/System', 'ShowAllTables.sql');
        const hasTableScriptBody = fs.readFileSync(hasTableScriptPath).toString('utf8');
        const { rows } = await db.module.queryPromise(hasTableScriptBody, null);
        if(rows.length > 0)
            throw new Error('Database already have tables!');

        const directoryPath = path.join(__dirname, '../../PsqlScripts/CreateTablesFromZero');

        var files = fs.readdirSync(directoryPath);

        files.forEach(async scriptFile => {
            const settingsBuffer = fs.readFileSync(path.join(directoryPath, scriptFile));
            const scriptBody = settingsBuffer.toString('utf8');

            await db.module.queryPromise(scriptBody, null);
        });
    }
}