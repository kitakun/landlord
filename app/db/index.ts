import path from 'path';
import fs from 'fs';

import { Pool, QueryResult, PoolClient } from 'pg';

const dbConfigPath = path.join(__dirname, '../database.json');
const settingsBuffer = fs.readFileSync(dbConfigPath);
const dbSettings = JSON.parse(settingsBuffer.toString('utf8'));

// https://node-postgres.com/features/queries
const pool = new Pool(dbSettings);

// Use ms logging?
const useLogging: boolean = true;

declare type IQueryCallback = (err: Error, res: QueryResult<any>) => void;

interface IPoolClientWithLog extends PoolClient {
    lastQuery: any;
    query: (...args: any) => any;
}

export default interface Idb {
    query(text: string, params: any[], callback: IQueryCallback): any;
    queryPromise(text: string, params: any): Promise<any>,
    getClient: (callback: (err: Error, client: PoolClient, done: (release?: any) => void) => void) => void;
    validateConnection(): Promise<boolean>;
    hasTables(): Promise<boolean>;
}

const moduleSingleton: Idb = {
    query: function (text: string, params: any[], callback: IQueryCallback) {
        if (useLogging) {
            const start = Date.now()
            return pool.query(text, params, (err, res) => {
                const duration = Date.now() - start
                console.log('[db] executed query', { text, duration, rows: res.rowCount })
                callback(err, res)
            });
        } else {
            return pool.query(text, params, callback);
        }
    },
    queryPromise: (text: string, params: any) => pool.query(text, params),
    getClient: (callback: (err: Error, client: PoolClient, done: (release?: any) => void) => void) => {
        if (!useLogging) {
            pool.connect((err, client, done) => {
                callback(err, client, done)
            });
        } else {
            pool.connect((err, client, done) => {
                const query = client.query
                // monkey patch the query method to keep track of the last query executed
                const typedClient = client as IPoolClientWithLog;
                typedClient.query = (...args: any) => {
                    typedClient.lastQuery = args
                    return query.apply(typedClient, args)
                };
                // set a timeout of 5 seconds, after which we will log this client's last query
                const timeout = setTimeout(() => {
                    console.error('[db] A client has been checked out for more than 5 seconds!')
                    console.error(`[db] The last executed query on this client was: ${typedClient.lastQuery}`)
                }, 5000);
                const release = (err: Error) => {
                    // call the actual 'done' method, returning this client to the pool
                    done(err)
                    // clear our timeout
                    clearTimeout(timeout)
                    // set the query method back to its old un-monkey-patched version
                    client.query = query
                };
                callback(err, client, release);
            });
        }
    },
    async validateConnection(): Promise<boolean> {
        var result = await pool.query('SELECT NOW()');
        return !!result;
    },
    async hasTables(): Promise<boolean>{
        const hasTableScriptPath = path.join(__dirname, '../../PsqlScripts/System', 'ShowAllTables.sql');
        const hasTableScriptBody = fs.readFileSync(hasTableScriptPath).toString('utf8');
        const { rows } = await this.queryPromise(hasTableScriptBody, null);
        return rows.length > 0;
    }
};

export { moduleSingleton as module };