"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const sdk_1 = require("@scrypted/sdk");
class WeatherStation extends sdk_1.ScryptedDeviceBase {
    constructor(nativeId) {
        super(nativeId);
        // Configuration values – you can later change these to be set via Scrypted's device configuration.
        this.stationId = 'YOUR_STATION_ID';
        this.apiKey = 'yourApiKey';
        // Optionally initialize any state here.
        this.console.log('WeatherStation plugin initialized.');
    }
    // Method to fetch current weather observation data
    async getWeatherObservation() {
        const url = `https://api.weather.com/v2/pws/observations/current?stationId=${this.stationId}&format=json&units=e&apiKey=${this.apiKey}`;
        this.console.log(`Fetching weather data from: ${url}`);
        try {
            const response = await axios_1.default.get(url);
            this.console.log('Weather observation data received.');
            return response.data;
        }
        catch (error) {
            this.console.error('Failed to fetch weather data:', error);
            throw error;
        }
    }
    // Example method to trigger an automation or process the data
    async updateWeatherStatus() {
        try {
            const data = await this.getWeatherObservation();
            // Here you could process the data and update device states, trigger events, etc.
            this.console.log(`Current Temperature: ${data.observations[0].tempF}°F`);
            // For example, you might update a property or trigger an event:
            // this.notifyInterface('OnOff', data.observations[0].tempF > 70);
        }
        catch (error) {
            this.console.error('Error updating weather status:', error);
        }
    }
}
exports.default = WeatherStation;
//# sourceMappingURL=main.js.map