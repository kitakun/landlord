import * as db from '../index';

const repository = {
    loadAllLandingsWithPortsAsync: () => db.module.queryPromise('SELECT "Id", "WebPort", "Name" FROM public."LandingEntity"', null),
    loadLandingPortByNameAsync: (landingName: string) => db.module.queryPromise('SELECT "WebPort" as "Port" FROM public."LandingEntity" WHERE "Name" = $1', [landingName]),
};

export default repository;