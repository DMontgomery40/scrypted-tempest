import { Settings, Sensors, Setting, SettingValue, ScryptedDeviceBase } from "@scrypted/sdk";
import ScryptedTempest from "./main";
import { StorageSettings } from "@scrypted/sdk/storage-settings";
import { convertForecastDataToSensors, ForecastData } from "./utils";

export class ScryptedTempestForecastDevice extends ScryptedDeviceBase implements Sensors, Settings {
    storageSettings = new StorageSettings(this, {});

    constructor(public plugin: ScryptedTempest, nativeId: string) {
        super(nativeId);
    }

    async getSettings(): Promise<Setting[]> {
        const settings = await this.storageSettings.getSettings();

        for (const sensor of Object.entries(this.sensors)) {
            const [entityId, { name, unit, value }] = sensor;
            let textValue = value;

            if (unit) {
                textValue += ` (${unit})`;
            }

            settings.push({
                key: entityId,
                title: `${name} (${entityId})`,
                type: 'string',
                readonly: true,
                value: textValue
            });
        }

        return settings;
    }

    putSetting(key: string, value: SettingValue): Promise<void> {
        return this.storageSettings.putSetting(key, value);
    }

    async updateState(data: ForecastData) {
        if (!this.sensors) {
            this.sensors = {};
        }

        const newSensorsData = convertForecastDataToSensors(data);

        for (const [sensorId, updatedSensorData] of Object.entries(newSensorsData)) {
            if (this.sensors[sensorId]?.value !== newSensorsData[sensorId]?.value) {
                this.sensors = {
                    ...this.sensors,
                    [sensorId]: updatedSensorData
                };

                await this.onDeviceEvent(sensorId, updatedSensorData);
            }
        }
    }
}