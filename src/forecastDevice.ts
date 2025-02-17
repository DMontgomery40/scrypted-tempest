import { Settings, Sensors, Setting, SettingValue, ScryptedDeviceBase } from "@scrypted/sdk";
import ScryptedTempest from "./main";
import { convertForecastDataToSensors, ForecastData } from "./utils";

export class ScryptedTempestForecastDevice extends ScryptedDeviceBase implements Sensors, Settings {
    settings: Setting[] = [];

    constructor(public plugin: ScryptedTempest, nativeId: string) {
        super(nativeId);
    }

    async getSettings(): Promise<Setting[]> {
        return this.settings;
    }

    putSetting(key: string, value: SettingValue): Promise<void> {
        return this.storage.putSetting(key, value);
    }

    async updateState(data: ForecastData) {
        if (!this.sensors) {
            this.sensors = {};
        }

        const { newSensorsData, settings } = convertForecastDataToSensors(data, this.plugin.storageSettings.values.units);
        this.settings = settings;

        for (const [sensorId, updatedSensorData] of Object.entries(newSensorsData)) {
            if (this.sensors[sensorId]?.value !== newSensorsData[sensorId]?.value) {
                await this.onDeviceEvent(sensorId, updatedSensorData);
            }
        }

        this.sensors = newSensorsData;
    }
}