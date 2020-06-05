import * as db from '../index';
// models
import { ILandingEntity } from '../../models';

const repository = {
    loadAllLandingsWithPortsAsync: () => db.module.queryPromise<PartLandingData>('SELECT "Id", "WebPort", "Name" FROM public."LandingEntity"', null),
    loadLandingPortByNameAsync: (landingName: string) => db.module.queryPromise<PartLandingDataByName>('SELECT "WebPort" as "Port" FROM public."LandingEntity" WHERE "Name" = $1', [landingName]),
    createNewSpace: (newEntity: ILandingEntity) => db.module.queryPromise(`INSERT INTO public."LandingEntity" ("Name", "WebPort", "RunAtStartup") VALUES ($1, $2, $3) RETURNING *`, [newEntity.Name, newEntity.WebPort, newEntity.RunAtStartup])
};

export interface PartLandingData {
    Id: number;
    WebPort: number;
    Name: string;
}

export interface PartLandingDataByName {
    Port: number;
}

export default repository;