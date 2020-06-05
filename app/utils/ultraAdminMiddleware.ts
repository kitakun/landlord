
import express = require('express');
// Components
import settings from '../services/SettingsService';

/**
 * Make controller accessible only for whitelisted persons
 */
export function ultraAdminMiddleware(req: express.Request, res: express.Response, next: () => void) {
    const currentIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const host = req.get('host');
    const settingsData = settings.getSettings();

    const ultraDomain = settingsData.UltraDomain || '';
    const trustedIPs = settingsData.TrustedIPs || [];

    if (trustedIPs.findIndex(f => f == currentIp) >= 0
        && ultraDomain == host) {
        next();
    } else {
        res
            .status(404)
            .send('Not found');
    }
}