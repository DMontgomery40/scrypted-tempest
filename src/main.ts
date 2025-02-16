import axios from 'axios';
import { ScryptedDeviceBase, Setting } from '@scrypted/sdk';
import { log } from 'console';
import { get } from 'http';

export default class ScryptedTempest extends ScryptedDeviceBase {
    stationId: string;
    apiKey: string;
    pollInterval: number = 60000;
    pollTimer!: NodeJS.Timeout;

    constructor(nativeId?: string) {
        super(nativeId);
        this.stationId = this.storage.getItem('stationId') || 'YOUR_STATION_ID';
        this.apiKey = this.storage.getItem('apiKey') || 'yourApiKey';
        this.console.log('scrypted-tempest plugin initialized.');
        this.startPolling();
    }

    startPolling() {
        if (this.pollTimer) clearInterval(this.pollTimer);
        this.pollTimer = setInterval(async () => {
            try {
                await this.updateStatus();
            } catch (err) {
                this.console.error('Error during polling updateStatus:', err);
            }
        }, this.pollInterval);
        this.console.log(`Polling started (every ${this.pollInterval / 1000} seconds).`);
    }

    async getObservation(): Promise<any> {
        const url = `https://api.weather.com/v2/pws/observations/current?stationId=${this.stationId}&format=json&units=e&apiKey=${this.apiKey}`;
        this.console.log(`Fetching observation data from: ${url}`);
        try {
            const response = await axios.get(url);
            this.console.log('Observation data received.');
            return response.data;
        } catch (error) {
            this.console.error('Failed to fetch observation data:', error);
            throw error;
        }
    }

    async updateStatus(): Promise<void> {
        try {
            const data = await this.getObservation();
            if (data && data.observations && data.observations.length > 0) {
                const obs = data.observations[0];
                this.console.log(`Current Temperature: ${obs.tempF}°F, Humidity: ${obs.humidity}%`);
                // Clone the data and remove any reserved keys
                const safeData = JSON.parse(JSON.stringify(data));
                if (safeData.type) delete safeData.type;
                if (Array.isArray(safeData.observations)) {
                    safeData.observations = safeData.observations.map((o: any) => {
                        if (o.type) delete o.type;
                        return o;
                    });
                }
                (this as any).updateState({ WeatherObservation: safeData });
            } else {
                this.console.warn('No observation data available.');
            }
        } catch (error) {
            this.console.error('Error updating status:', error);
        }
    }

    async getSettings(): Promise<Setting[]> {
        return [
            { key: 'stationId', title: 'Station ID', description: 'Your Tempest Station ID', value: this.stationId },
            { key: 'apiKey', title: 'API Key', description: 'Your Tempest API Key', value: this.apiKey }
        ];
    }

    async updateSettings(settings: { [key: string]: string }): Promise<void> {
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
