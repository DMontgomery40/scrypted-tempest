import { Sensor, Setting } from "@scrypted/sdk"
import { UnitConverter, Unit, UnitGroup } from '../../scrypted-homeassistant/src/unitConverter';

export interface Observations {
    observations: ObservationsData[];
}

export interface ObservationsData {
    stationID: string
    obsTimeUtc: string
    obsTimeLocal: string
    neighborhood: string
    softwareType: string
    country: string
    solarRadiation: number
    lon: number
    realtimeFrequency: any
    epoch: number
    lat: number
    uv: number
    winddir: number
    humidity: number
    qcStatus: number
    metric: {
        temp: number
        heatIndex: number
        dewpt: number
        windChill: number
        windSpeed: number
        windGust: number
        pressure: number
        precipRate: number
        precipTotal: number
        elev: number
    }
}


export interface ForecastData {
    calendarDayTemperatureMax: number[]
    calendarDayTemperatureMin: number[]
    dayOfWeek: string[]
    expirationTimeUtc: number[]
    moonPhase: string[]
    moonPhaseCode: string[]
    moonPhaseDay: number[]
    moonriseTimeLocal: string[]
    moonriseTimeUtc: number | undefined[]
    moonsetTimeLocal: string[]
    moonsetTimeUtc: number[]
    narrative: string[]
    qpf: number[]
    qpfSnow: number[]
    sunriseTimeLocal: string[]
    sunriseTimeUtc: number[]
    sunsetTimeLocal: string[]
    sunsetTimeUtc: number[]
    temperatureMax: number[]
    temperatureMin: number[]
    validTimeLocal: string[]
    validTimeUtc: number[]
    daypart: Daypart[]
}

export interface Daypart {
    cloudCover: number[]
    dayOrNight: string[]
    daypartName: string[]
    iconCode: number[]
    iconCodeExtend: number[]
    narrative: string[]
    precipChance: number[]
    precipType: string[]
    qpf: number[]
    qpfSnow: number[]
    qualifierCode: string | undefined[]
    qualifierPhrase: string | undefined[]
    relativeHumidity: number[]
    snowRange: string[]
    temperature: number[]
    temperatureHeatIndex: number[]
    temperatureWindChill: number[]
    thunderCategory: any[]
    thunderIndex: number[]
    uvDescription: string[]
    uvIndex: number[]
    windDirection: number[]
    windDirectionCardinal: string[]
    windPhrase: string[]
    windSpeed: number[]
    wxPhraseLong: string[]
    wxPhraseShort: string[]
}

export const convertWeatherDataToSensors = (data: ObservationsData) => {
    const newSensorsData: Record<string, Sensor> = {};

    newSensorsData['solarRadiation'] = {
        name: 'Solar radiation',
        unit: 'W/m²',
        value: data.solarRadiation,
    };
    newSensorsData['uvIndex'] = {
        name: 'UV index',
        value: data.uv,
    };
    newSensorsData['windDirection'] = {
        name: 'Wind direction',
        unit: '°',
        value: data.uv,
    };
    newSensorsData['humidity'] = {
        name: 'Humidity',
        unit: '%',
        value: data.humidity,
    };
    newSensorsData['temperature'] = {
        name: 'Temperature',
        unit: '°C',
        value: data.metric.temp,
    };
    newSensorsData['heatIndex'] = {
        name: 'Head index',
        value: data.metric.heatIndex,
    };
    newSensorsData['dewPoint'] = {
        name: 'Dew point',
        unit: '°C',
        value: data.metric.dewpt,
    };
    newSensorsData['windChill'] = {
        name: 'Wind chill',
        unit: '°C',
        value: data.metric.windChill,
    };
    newSensorsData['windSpeed'] = {
        name: 'Wind speed',
        unit: 'km/h',
        value: data.metric.windSpeed,
    };
    newSensorsData['windGust'] = {
        name: 'Wind gust',
        unit: 'km/h',
        value: data.metric.windGust,
    };
    newSensorsData['pressure'] = {
        name: 'Pressure',
        unit: 'hPa',
        value: data.metric.pressure,
    };
    newSensorsData['rainRate'] = {
        name: 'Rain rate',
        unit: 'mm/h',
        value: data.metric.precipRate,
    };
    newSensorsData['elevation'] = {
        name: 'Elevation',
        unit: 'm',
        value: data.metric.elev,
    };

    return newSensorsData;
}

export enum UnitsSelector {
    Imperial = 'e=English',
    Metric = 'm=Metric',
}

const getUnit = (units: UnitsSelector, unitGroup: UnitGroup) => {
    const isMetric = units === UnitsSelector.Metric;
    if (unitGroup === UnitGroup.Temperature) {
        return isMetric ? Unit.C : Unit.F;
    } else if (unitGroup === UnitGroup.Speed) {
        return isMetric ? Unit.KM_H : Unit.MI_H;
    }
}

export const convertForecastDataToSensors = (data: ForecastData, units: UnitsSelector) => {
    const daysAmount = data.dayOfWeek.length;
    const partsPerDay = data.daypart[0].daypartName.length / daysAmount;

    const dayIndexes = Array.from(Array(daysAmount), (_, index) => index);
    const settings: Setting[] = [];
    const newSensorsData: Record<string, Sensor> = {};

    for (const dayIndex of dayIndexes) {
        const dayPartIndexes = Array.from(Array(partsPerDay), (_, index) => index);
        const group = dayIndex === 0 ? 'Today' : data.dayOfWeek[dayIndex];

        const addSetting = (props: {
            name: string;
            sensorId: string;
            subgroup?: string;
            value: any;
            unit?: string;
        }) => {
            const { name, sensorId, subgroup, value, unit } = props;
            let textValue = value;

            if (unit) {
                textValue += ` (${unit})`;
            }

            newSensorsData[sensorId] = {
                name,
                unit,
                value,
            };

            settings.push({
                key: sensorId,
                title: `${name} (${sensorId})`,
                type: 'string',
                readonly: true,
                value: textValue,
                group,
                subgroup,
            });
        };

        addSetting({
            name: `Narrative ${group}`,
            sensorId: `narrative${dayIndex}`,
            value: data.narrative[dayIndex],
        });
        addSetting({
            name: `Expiration time UTC ${group}`,
            sensorId: `expirationTime${dayIndex}`,
            value: data.expirationTimeUtc[dayIndex],
        });
        addSetting({
            name: `Moonphase ${group}`,
            sensorId: `moonPhase${dayIndex}`,
            value: data.moonPhase[dayIndex],
        });
        addSetting({
            name: `Moonrise time local ${group}`,
            sensorId: `moonriseTimeLocal${dayIndex}`,
            value: data.moonriseTimeLocal[dayIndex],
        });
        addSetting({
            name: `Moonset time local ${group}`,
            sensorId: `moonsetTimeLocal${dayIndex}`,
            value: data.moonsetTimeLocal[dayIndex],
        });
        addSetting({
            name: `Sunrise time local ${group}`,
            sensorId: `sunriseTimeLocal${dayIndex}`,
            value: data.sunriseTimeLocal[dayIndex],
        });
        addSetting({
            name: `Temperature max ${group}`,
            sensorId: `temperatureMax${dayIndex}`,
            value: UnitConverter.localToSi(data.temperatureMax[dayIndex], getUnit(units, UnitGroup.Temperature)),
            unit: Unit.C
        });
        addSetting({
            name: `Temperature min ${group}`,
            sensorId: `temperatureMax${dayIndex}`,
            value: UnitConverter.localToSi(data.temperatureMax[dayIndex], getUnit(units, UnitGroup.Temperature)),
            unit: Unit.C
        });

        for (const dayPartIndex of dayPartIndexes) {
            const partIndex = dayPartIndex + (dayIndex * partsPerDay);
            const partName = data.daypart[0]?.daypartName[partIndex];
            const partCode = data.daypart[0]?.dayOrNight[partIndex];

            if (partName) {
                addSetting({
                    name: `Narrative ${partName}`,
                    sensorId: `narrative${dayIndex}${partCode}`,
                    value: data.daypart[0]?.narrative[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Qualifier phrase ${partName}`,
                    sensorId: `qualifierPhrase${dayIndex}${partCode}`,
                    value: data.daypart[0]?.qualifierPhrase[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Sensible weather phrase ${partName}`,
                    sensorId: `sensibleWeatherPhrase${dayIndex}${partCode}`,
                    value: data.daypart[0]?.wxPhraseLong[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Cloud coverage ${partName}`,
                    sensorId: `cloudCover${dayIndex}${partCode}`,
                    value: data.daypart[0]?.cloudCover[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Precipitation chance ${partName}`,
                    sensorId: `precipChance${dayIndex}${partCode}`,
                    value: data.daypart[0]?.precipChance[partIndex],
                    unit: '%',
                    subgroup: partName
                });
                addSetting({
                    name: `Precipitation type ${partName}`,
                    sensorId: `precipType${dayIndex}${partCode}`,
                    value: data.daypart[0]?.precipType[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Relative humidity ${partName}`,
                    sensorId: `relativeHumidity${dayIndex}${partCode}`,
                    value: data.daypart[0]?.relativeHumidity[partIndex],
                    unit: '%',
                    subgroup: partName
                });
                addSetting({
                    name: `Temperature ${partName}`,
                    sensorId: `temperature${dayIndex}`,
                    value: UnitConverter.localToSi(data.daypart[0]?.temperature[partIndex], getUnit(units, UnitGroup.Temperature)),
                    unit: Unit.C
                });
                addSetting({
                    name: `Heat index ${partName}`,
                    sensorId: `temperatureHeatIndex${dayIndex}${partCode}`,
                    value: data.daypart[0]?.temperatureHeatIndex[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Thunder index ${partName}`,
                    sensorId: `thunderIndex${dayIndex}${partCode}`,
                    value: data.daypart[0]?.thunderIndex[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `UV index ${partName}`,
                    sensorId: `uvIndex${dayIndex}${partCode}`,
                    value: data.daypart[0]?.uvIndex[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `UV phrase ${partName}`,
                    sensorId: `uvDescription${dayIndex}${partCode}`,
                    value: data.daypart[0]?.uvDescription[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Wind chill ${partName}`,
                    sensorId: `uvDescription${dayIndex}${partCode}`,
                    value: UnitConverter.localToSi(data.daypart[0]?.temperatureWindChill[partIndex], getUnit(units, UnitGroup.Temperature)),
                    unit: Unit.C,
                    subgroup: partName
                });
                addSetting({
                    name: `Wind direction ${partName}`,
                    sensorId: `windDirection${dayIndex}${partCode}`,
                    value: data.daypart[0]?.windDirection[partIndex],
                    unit: '°',
                    subgroup: partName
                });
                addSetting({
                    name: `Wind phrase ${partName}`,
                    sensorId: `windPhrase${dayIndex}${partCode}`,
                    value: data.daypart[0]?.windPhrase[partIndex],
                    subgroup: partName
                });
                addSetting({
                    name: `Wind speed ${partName}`,
                    sensorId: `windSpeed${dayIndex}${partCode}`,
                    value: UnitConverter.localToSi(data.daypart[0]?.windSpeed[partIndex], getUnit(units, UnitGroup.Speed)),
                    unit: Unit.M_S,
                    subgroup: partName
                });
            }
        }
    }

    return { newSensorsData, settings };
}