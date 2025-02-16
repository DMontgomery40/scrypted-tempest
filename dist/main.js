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
        this.pollInterval = 60000;
        this.stationId = this.storage.getItem('stationId') || 'YOUR_STATION_ID';
        this.apiKey = this.storage.getItem('apiKey') || 'yourApiKey';
        this.console.log('scrypted-tempest plugin initialized.');
        this.startPolling();
    }
    startPolling() {
        if (this.pollTimer)
            clearInterval(this.pollTimer);
        this.pollTimer = setInterval(async () => {
            try {
                await this.updateStatus();
            }
            catch (err) {
                this.console.error('Error during polling updateStatus:', err);
            }
        }, this.pollInterval);
        this.console.log(`Polling started (every ${this.pollInterval / 1000} seconds).`);
    }
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
    async updateStatus() {
        try {
            const data = await this.getObservation();
            if (data && data.observations && data.observations.length > 0) {
                const obs = data.observations[0];
                this.console.log(`Current Temperature: ${obs.tempF}°F, Humidity: ${obs.humidity}%`);
                // Emit the full API response as event data by updating the device state.
                this.updateState({ WeatherObservation: data });
            }
            else {
                this.console.warn('No observation data available.');
            }
        }
        catch (error) {
            this.console.error('Error updating status:', error);
        }
    }
    async getSettings() {
        return [
            { key: 'stationId', title: 'Station ID', description: 'Your Tempest Station ID', value: this.stationId },
            { key: 'apiKey', title: 'API Key', description: 'Your Tempest API Key', value: this.apiKey }
        ];
    }
    async updateSettings(settings) {
        const allowedKeys = new Set(['stationId', 'apiKey']);
        for (const key in settings) {
            if (!allowedKeys.has(key)) {
                this.console.warn(`Ignoring reserved key update: ${key}`);
                continue;
            }
            switch (key) {
                case 'stationId':
                    this.stationId = settings.stationId;
                    this.storage.setItem('stationId', settings.stationId);
                    break;
                case 'apiKey':
                    this.apiKey = settings.apiKey;
                    this.storage.setItem('apiKey', settings.apiKey);
                    break;
            }
        }
        this.console.log('scrypted-tempest settings updated.');
        this.startPolling();
    }
}
exports.default = ScryptedTempest;
