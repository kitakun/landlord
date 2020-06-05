import { PartLandingData } from "../db/Repositories/LandingEntityRepo";

export interface AdminExisgintSpace extends PartLandingData {
    isEnabled: boolean;
}