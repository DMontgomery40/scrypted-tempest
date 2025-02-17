import { Sensor } from "@scrypted/sdk"

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

interface DayForecastPartData {
    name: string;
    cloudCover: number;
    narrative: string;
    precipitationChange: number;
    precipitationType: string;
    qualifierPhrase?: string;
    relativeHumidity: number;
    temperature: number;
    heatIndex: number;
    windChill: number;
    thunderIndex: number;
    uvIndex: number;
    uvPhrase: string;
    windSpeed: number;
    windDirection: number;
    windPhrase: string;
    sensibleWeatherPhrase: string;
}

export interface DayForecastData {
    dayOfWeek: string;
    expirationTimeUtc: string;
    moonPhase: string;
    moonriseTimeLocal: string;
    moonsetTimeLocal: string;
    sunriseTimeLocal: string;
    sunsetTimeLocal: string;
    narrative: string;
    temperatureMax: number;
    temperatureMin: number;
    parts: DayForecastPartData[];
}

export const convertForecastDataToSensors = (data: ForecastData) => {
    const newSensorsData: Record<string, Sensor> = {};

    const daysData: DayForecastPartData[] = [];
    const daysAmount = data.dayOfWeek.length;
    const partsPerDay = data.daypart.length / daysAmount;

    const dayIndexes = Array.from({ length: daysAmount + 1 }, (_, index) => index);

    for (const dayIndex of dayIndexes) {
        const dayPartIndexes = Array.from({ length: partsPerDay + 1 }, (_, index) => index);
        const groupName = data.daypart[dayIndex]

    }


    return newSensorsData;
}