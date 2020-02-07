import fs from 'fs';
import path from 'path';

import ILandingAppSettings from '../models/Settingsmodel';

const settingFilePath = path.join(__dirname, '../settings.json');

var settings: ILandingAppSettings = {};

function updateSettingData(): void {
    fs.readFile(settingFilePath, (err, settingsBuffer) => {
        if (err)
            throw err;
        try {
            settings = JSON.parse(settingsBuffer.toString('utf8'));
            console.log('[SettingsService] Settings updated successfully');
        } catch {
            console.error('[SettingsService] error happened while updating settings');
        }
    });
}

/**
 * Start tracking settings.json file and if changes appear, realod settings model
 */
const startWatching = () => {
    console.log('[SettingsService] Settings file being watched');
    updateSettingData();
    fs.watchFile(settingFilePath, { interval: 2500 }, (curr, prev) => {
        console.log('[SettingsService] Settings has changed');
        updateSettingData();
    });
}

const getSettings = () => settings;

export = { getSettings, startWatching };