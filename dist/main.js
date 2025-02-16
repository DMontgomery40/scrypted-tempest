"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const sdk_1 = require("@scrypted/sdk");
class ScryptedTempest extends sdk_1.ScryptedDeviceBase {
    constructor(nativeId) {
        super(nativeId);
        // Load existing settings from storage or use default placeholders.
        this.stationId = this.storage.getItem('stationId') || 'YOUR_STATION_ID';
        this.apiKey = this.storage.getItem('apiKey') || 'yourApiKey';
        this.console.log('scrypted-tempest plugin initialized.');
    }
    // Fetch observation data from the Tempest API.
    async getObservation() {
        const url = `https://api.weather.com/v2/pws/observations/current?stationId=${this.stationId}&format=json&units=e&apiKey=${this.apiKey}`;
        this.console.log(`Fetching observation data from: ${url}`);
        try {
            const response = await axios_1.default.get(url);
            this.console.log('Observation data received.');
            return response.data;
        }
        catch (error) {
            this.console.error('Failed to fetch observation data:', error);
            throw error;
        }
    }
    // Example method to update status (e.g., log current temperature).
    async updateStatus() {
        try {
            const data = await this.getObservation();
            this.console.log(`Current Temperature: ${data.observations[0].tempF}°F`);
            // You could trigger automations or update device properties here.
        }
        catch (error) {
            this.console.error('Error updating status:', error);
        }
    }
    // Expose configuration settings to the Scrypted UI.
    async getSettings() {
        return [
            {
                key: 'stationId',
                title: 'Station ID',
                description: 'Your Tempest Station ID',
                value: this.stationId,
            },
            {
                key: 'apiKey',
                title: 'API Key',
                description: 'Your Tempest API Key',
                value: this.apiKey,
            },
        ];
    }
    async updateSettings(settings) {
        // Remove any reserved properties
        if (settings.type !== undefined) {
            delete settings.type;
        }
        if (settings.stationId !== undefined) {
            this.stationId = settings.stationId;
            this.storage.setItem('stationId', settings.stationId);
        }
        if (settings.apiKey !== undefined) {
            this.apiKey = settings.apiKey;
            this.storage.setItem('apiKey', settings.apiKey);
        }
        this.console.log('scrypted-tempest settings updated.');
    }
}
exports.default = ScryptedTempest;
