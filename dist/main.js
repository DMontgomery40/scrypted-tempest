import axios from 'axios';
import { ScryptedDeviceBase } from '@scrypted/sdk';
export default class ScryptedTempest extends ScryptedDeviceBase {
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
            const response = await axios.get(url);
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
                const safeData = JSON.parse(JSON.stringify(data));
                if (safeData.type)
                    delete safeData.type;
                if (Array.isArray(safeData.observations)) {
                    safeData.observations = safeData.observations.map((o) => {
                        if (o.type)
                            delete o.type;
                        return o;
                    });
                }
                this.updateState({ WeatherObservation: safeData });
            }
            else {
                this.console.warn('No observation data available.');
            }
        }
        catch (error) {
            this.console.error('Error updating status:', error);
        }
    }
    async getForecast() {
        const geocode = this.storage.getItem('forecastGeocode') || 'YOUR_GEOCODE';
        const url = `https://api.weather.com/v3/wx/forecast/daily/5day?geocode=${geocode}&format=json&units=e&language=en-US&apiKey=${this.apiKey}`;
        this.console.log(`Fetching forecast data from: ${url}`);
        try {
            const response = await axios.get(url);
            this.console.log('Forecast data received.');
            return response.data;
        }
        catch (error) {
            this.console.error('Failed to fetch forecast data:', error);
            throw error;
        }
    }
    async updateForecast() {
        try {
            const data = await this.getForecast();
            if (data) {
                this.console.log('Updating forecast state');
                this.updateState({ Forecast: data });
            }
            else {
                this.console.warn('No forecast data available.');
            }
        }
        catch (error) {
            this.console.error('Error updating forecast:', error);
        }
    }
    async getSettings() {
        return [
            { key: 'stationId', title: 'Station ID', description: 'Your Tempest Station ID', value: this.stationId },
            { key: 'apiKey', title: 'API Key', description: 'Your Tempest API Key', value: this.apiKey },
            { key: 'forecastGeocode', title: 'Forecast Geocode', description: 'Geocode for 5-day forecast (e.g., 33.74,-84.39)', value: this.storage.getItem('forecastGeocode') || 'YOUR_GEOCODE' }
        ];
    }
    async updateSettings(settings) {
        const allowedKeys = new Set(['stationId', 'apiKey', 'forecastGeocode']);
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
                case 'forecastGeocode':
                    this.storage.setItem('forecastGeocode', settings.forecastGeocode);
                    break;
            }
        }
        this.console.log('scrypted-tempest settings updated.');
        this.startPolling();
    }
}
