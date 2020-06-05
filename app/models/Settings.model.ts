/**
 * Global application admin settings
 */
export default interface ILandingAppSettings {
    /**
     * Ip's, who can control whole spaces process
     */
    TrustedIPs?: Array<string>;
    /**
     * Root app url
     */
    UltraDomain?: string;
}