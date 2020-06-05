/**
 * Represents one Space global setting
 */
interface ILandingEntity {
    /**
     * Identifier
     */
    Id?: number;
    /**
     * Name for admin's
     */
    Name: string;
    /**
     * Used port by server
     */
    WebPort: number;
    /**
     * Run this space on global server startup
     */
    RunAtStartup: boolean;

    /**
     * All used data for custom logic
     */
    Data?: ILandingDataEntity[];
}

/**
 * Represents custom logic data for single space
 */
interface ILandingDataEntity {
    /**
     * Identifier
     */
    Id: number;
    /**
     * Link to existing Space
     */
    LandingEntityId: number;

    /**
     * Custom JS data
     */
    Data: any;
}

export { ILandingEntity, ILandingDataEntity };