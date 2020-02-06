interface ILandingEntity {
    Id: number;
    Name: string;

    Data: ILandingDataEntity[] | undefined;
}

interface ILandingDataEntity {
    Id: number;
    LandingEntityId: number;

    Data: any;
}

export { ILandingEntity, ILandingDataEntity };