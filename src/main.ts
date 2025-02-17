import sdk, { DeviceManifest, DeviceProvider, ScryptedDeviceBase, ScryptedDeviceType, ScryptedInterface, ScryptedNativeId, Setting, Settings, SettingValue } from '@scrypted/sdk';
import { StorageSettings } from '@scrypted/sdk/storage-settings';
import axios from 'axios';
import { ScryptedTempestForecastDevice } from './forecastDevice';
import { ScryptedTempestObservationsDevice } from './observationsDevice';
import { ForecastData, Observations } from './utils';

const observationsNativeId = 'weather-observations';
const forecastNativeId = 'weather-forecast';

export default class ScryptedTempest extends ScryptedDeviceBase implements DeviceProvider, Settings {
    storageSettings = new StorageSettings(this, {
        stationId: {
            type: 'string',
            title: 'Station ID',
            description: 'Your Tempest Station ID'
        },
        apiKey: {
            type: 'password',
            title: 'Api KEY',
            description: 'Your Tempest API Key'
        },
        forecastGeocode: {
            type: 'string',
            group: 'Forecast',
            title: 'Forecast Geocode',
            description: 'Geocode for 5-day forecast (e.g., 33.74,-84.39)',
            placeholder: '33.74,-84.39',
        },
        languageCode: {
            type: 'string',
            group: 'Forecast',
            title: 'Language code',
            description: 'Define the language used to provide the forecast',
            placeholder: 'en-US',
            defaultValue: 'en-US',
        },
        units: {
            type: 'string',
            group: 'Forecast',
            title: 'Units',
            description: 'Define the units used to provide the forecast',
            defaultValue: 'e=English',
            choices: [
                'e=English',
                'm=Metric',
                'he=Hybrid',
            ],
        },
        pollInterval: {
            type: 'number',
            title: 'Update interval in seconds',
            defaultValue: 60,
            onPut: async () => this.startPolling()
        },
        timeUtc: {
            type: 'string',
            title: 'UTC time',
            readonly: true,
            group: 'Station information'
        },
        timeLocal: {
            type: 'string',
            title: 'Local time',
            readonly: true,
            group: 'Station information'
        },
        location: {
            type: 'string',
            title: 'Station location',
            readonly: true,
            group: 'Station information'
        },
        softwareType: {
            type: 'string',
            title: 'Software type',
            readonly: true,
            group: 'Station information'
        },
    });

    pollTimer!: NodeJS.Timeout;
    observationDevice: ScryptedTempestObservationsDevice;
    forecastDevice: ScryptedTempestForecastDevice;

    constructor(nativeId?: string) {
        super(nativeId);

        this.init().catch(this.console.log);
    }

    async init() {
        const rootManifest: DeviceManifest = {
            devices: [
                {
                    nativeId: observationsNativeId,
                    name: 'Tempest weather observations',
                    interfaces: [
                        ScryptedInterface.Sensors,
                        ScryptedInterface.Settings,
                    ],
                    type: ScryptedDeviceType.Sensor,
                    info: {
                        manufacturer: 'Tempest weather',
                    }
                },
                {
                    nativeId: forecastNativeId,
                    name: 'Tempest weather forecast',
                    interfaces: [
                        ScryptedInterface.Sensors,
                        ScryptedInterface.Settings,
                    ],
                    type: ScryptedDeviceType.Sensor,
                    info: {
                        manufacturer: 'Tempest weather'
                    }
                },
            ],
        };

        await sdk.deviceManager.onDevicesChanged(rootManifest);

        await this.startPolling();
    }

    async getDevice(nativeId: string): Promise<any> {
        if (nativeId === observationsNativeId) {
            if (this.observationDevice) {
                return this.observationDevice;
            }

            const ret = new ScryptedTempestObservationsDevice(this, observationsNativeId);
            this.observationDevice = ret
            return ret;
        }

        if (nativeId === observationsNativeId) {
            if (this.forecastDevice) {
                return this.forecastDevice;
            }

            const ret = new ScryptedTempestForecastDevice(this, observationsNativeId);
            this.forecastDevice = ret
            return ret;
        }
    }

    releaseDevice(id: string, nativeId: ScryptedNativeId): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async startPolling() {
        if (this.pollTimer) clearInterval(this.pollTimer);

        const { pollInterval } = this.storageSettings.values;
        const funct = async () => {
            try {
                await this.updateStatus();
                await this.updateForecast();
            } catch (err) {
                this.console.error('Error during polling updateStatus:', err);
            }
        };
        this.pollTimer = setInterval(funct, pollInterval * 1000);
        await funct();
        this.console.log(`Polling started (every ${pollInterval} seconds).`);
    }

    async getObservation() {
        const { stationId, apiKey } = this.storageSettings.values;
        const url = `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${apiKey}`;
        this.console.log(`Fetching observation data from: ${url}`);
        try {
            const response = await axios.get<Observations>(url);
            this.console.log(`Observation data received: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            this.console.error('Failed to fetch observation data:', error);
            throw error;
        }
    }

    async updateStatus(): Promise<void> {
        try {
            const data = await this.getObservation();
            if (data.observations && data.observations.length > 0) {
                const obs = data.observations[0];
                this.observationDevice?.updateState(obs);

                this.storageSettings.values.timeUtc = obs.obsTimeUtc;
                this.storageSettings.values.timeLocal = obs.obsTimeLocal;
                this.storageSettings.values.softwareType = obs.softwareType;
                this.storageSettings.values.location = `${obs.country}, ${obs.neighborhood}, ${obs.lat} - ${obs.lon}`;
            } else {
                this.console.warn('No observation data available.');
            }
        } catch (error) {
            this.console.error('Error updating status:', error);
        }
    }

    async getForecast(): Promise<any> {
        const { forecastGeocode, apiKey, languageCode, units } = this.storageSettings.values;
        const unitsCode = units.split('=')[0];
        if (forecastGeocode) {
            const url = `https://api.weather.com/v3/wx/forecast/daily/5day?geocode=${forecastGeocode}&format=json&units=${unitsCode}&language=${languageCode}&apiKey=${apiKey}`;
            this.console.log(`Fetching forecast data from: ${url}`);
            try {
                const response = await axios.get<ForecastData>(url);
                this.console.log(`Forecast data received: ${JSON.stringify(response.data)}`);
                return response.data;
            } catch (error) {
                this.console.error('Failed to fetch forecast data:', error);
                throw error;
            }
        }
    }

    async updateForecast(): Promise<void> {
        try {
            const data = await this.getForecast();
            if (data) {
                this.forecastDevice?.updateState(data);
            } else {
                this.console.warn('No forecast data available.');
            }
        } catch (error) {
            this.console.error('Error updating forecast:', error);
        }
    }

    async getSettings(): Promise<Setting[]> {
        return this.storageSettings.getSettings();
    }

    putSetting(key: string, value: SettingValue): Promise<void> {
        return this.storageSettings.putSetting(key, value);
    }
}
