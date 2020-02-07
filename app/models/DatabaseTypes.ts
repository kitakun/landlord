interface ILandingEntity {
    Id: number;
    Name: string;
    WebPort: number;
    RunAtStartup: boolean;

    Data: ILandingDataEntity[] | undefined;
}

interface ILandingDataEntity {
    Id: number;
    LandingEntityId: number;

    Data: any;
}

export { ILandingEntity, ILandingDataEntity };