import * as db from '../index';

const repository = {
    loadAllLandingsWithPortsAsync: () => db.module.queryPromise<PartLandingData>('SELECT "Id", "WebPort", "Name" FROM public."LandingEntity"', null),
    loadLandingPortByNameAsync: (landingName: string) => db.module.queryPromise<PartLandingDataByName>('SELECT "WebPort" as "Port" FROM public."LandingEntity" WHERE "Name" = $1', [landingName]),
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