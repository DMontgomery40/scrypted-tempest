
Weather Company Data |  PWS Observations - Current Conditions - v2
Domain Portfolio: Observations  |  Domain: Current Conditions  |  API Name: PWS Observations - Current Conditions - v2
Geography: Global
Attribution Required: NO
Attribution Requirements:  N/A




Overview
Personal Weather Stations (PWS) Current Conditions returns the current conditions observations for the current record.Current record is the last record reported within 60 minutes. If the station has not reported a current conditions in the past 60 minutes, the response will not return an expired observation record (older than 60 minutes); a 'Data Expired' message will be returned instead.
HTTP Headers and Data Lifetime - Caching and Expiration
For details on appropriate header values as well as caching and expiration definitions, please see The Weather Company Data | API Common Usage Guide.
Unit of Measure Requirement
The unit of measure for the response. The following values are supported:
e = English units
m = Metric units
h = Hybrid units (UK)

*Note Aggregate Product Name not intended for use unless it is in conjuction with one or more additional products.
URL Construction
Atomic API URL Examples: 
Aggregate Product Name
v2pwsObsCur*
Request by PWS Station ID: Required Parameters: format, units, apiKey  | Optional Parameter: numericPrecision
https://api.weather.com/v2/pws/observations/current?stationId=KMAHANOV10&format=json&units=e&apiKey=yourApiKey


Valid Parameter Definitions
Parameter Name
Valid Parameter Value
Description
numericPrecision
decimal
Optional parameter.  Set to ‘decimal’ to ensure data is returned in decimal format when needed.  Will return integers if this value is not used.


Data Elements & Definitions
Note: Field names are sorted alphabetically in the table below for presentation purposes. The table below does not represent the sort order of the API response. 
Field Name
Description
Type
Range
Sample
Nulls Allowed
country
Country Code
string


US
Y
epoch
Time in UNIX seconds
epoch


1475157931
Y
humidity
The relative humidity of the air.
integer/decimal


71
Y
lat
Latitude of PWS
decimal
Any valid latitude value. -90 to 90
32.50828934
Y
lon
Longitude of PWS
decimal
Any valid longitude value. -180 to 180
-110.8763962
Y
neighborhood
Neighborhood associated with the PWS location
string


WOW Arizona!
Y
obsTimeLocal
Time observation is valid in local apparent time by timezone - tz
ISO
YYYYY-MM-dd HH:mm:ss
2016-09-29 14:05:31
Y
obsTimeUtc
GMT(UTC) time
ISO
ISO 8601 - yyyy-MM-dd'T'HH:mm:ssZZ 
2016-09-29T14:05:31Z
Y
qcStatus
Quality control indicator:
-1: No quality control check performed
 0: This observation was marked as possibly incorrect by our quality control algorithm
 1: This observation passed quality control checks
integer
-1 to 1
1
N
realtimeFrequency
Frequency of data report updates in minutes
integer/decimal


5
Y
softwareType
Software type of the PWS
string


WS-1001 V2.2.9
Y
solarRadiation
Solar Radiation
integer/decimal


92.0
Y
stationID
ID as registered by wunderground.com
string


KAZTUCSO539
N
uv
UV reading of the intensity of solar radiation
integer/decimal


1.2
Y
winddir
Wind Direction
integer/decimal


52
Y
imperial
metric
metric_si
uk_hybrid
Object containing fields that use a defined unit of measure. The object label is dependent on the units parameter assigned in the request.
"imperial", "metric", "metric_si", "uk_hybrid"
object


imperial: {.....}
N
dewpt
The temperature which air must be cooled at constant pressure to reach saturation. The Dew Point is also an indirect measure of the humidity of the air. The Dew Point will never exceed the Temperature. When the Dew Point and Temperature are equal, clouds or fog will typically form. The closer the values of Temperature and Dew Point, the higher the relative humidity.
integer/decimal
-80 to 100 (°F) or
-62 to 37 (°C)
58
Y
elev
Elevation
integer/decimal


3094
Y
heatIndex
Heat Index - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
When the temperature is 70°F or higher, the Feels Like value represents the computed Heat Index.
integer/decimal


67
Y
precipRate
Rate of precipitation - instantaneous precipitation rate.  How much rain would fall if the precipitation intensity did not change for one hour
integer/decimal


0.0
Y
precipTotal
Accumulated precipitation for today from midnight to present.
integer/decimal


0.0
Y
pressure
Mean Sea Level Pressure, the equivalent pressure reading at sea level recorded at this station
integer/decimal


30.06
Y
temp
Temperature in defined unit of measure.
integer/decimal


67
Y
windChill
Wind Chill - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the cold temperatures and wind speed.
When the temperature is 61°F or lower the Feels Like value represents the computed Wind Chill so display the Wind Chill value.
integer/decimal


-34
Y
windGust
Wind Gust - sudden and temporary variations of the average Wind Speed. The report always shows the maximum wind gust speed recorded during the observation period. It is a required display field if Wind Speed is shown.
integer/decimal


56
Y
windSpeed
Wind Speed - The wind is treated as a vector; hence, winds must have direction and magnitude (speed). The wind information reported in the hourly current conditions corresponds to a 10-minute average called the sustained wind speed. Sudden or brief variations in the wind speed are known as “wind gusts” and are reported in a separate data field.
Wind directions are always expressed as ""from whence the wind blows"" meaning that a North wind blows from North to South. If you face North in a North wind the wind is at your face. Face southward and the North wind is at your back.
integer/decimal


56
Y


JSON Sample
{
observations: [
{
stationID: "KNCCARY89",
obsTimeUtc: "2019-02-04T14:53:14Z",
obsTimeLocal: "2019-02-04 09:53:14",
neighborhood: "Highcroft Village",
softwareType: "GoWunder 1337.9041ac1",
country: "US",
solarRadiation: 436.0,
lon: -78.8759613,
realtimeFrequency: null,
epoch: 1549291994,
lat: 35.80221176,
uv: 1.2,
winddir: 329,
humidity: 71,
qcStatus: 1,
imperial: {
temp: 53,
heatIndex: 53,
dewpt: 44,
windChill: 53,
windSpeed: 2,
windGust: null,
pressure: 30.09,
precipRate: 0.0,
precipTotal: 0.0,
elev: 413
}
}
]
}


""""""""""""""""""""""""""""""forecast"""""""""""""""""""""""""""""


5 Day Daily Forecast for Personal Weather Station Owners - v3.0
Domain Portfolio: Forecast  |  Domain: Daily Forecasts  |  Usage Classification: Standard
Geography: Global
Attribution Required: NO
Attribution Requirements:  N/A




Overview
The Daily Forecast  API is sourced from the The Weather Company Forecast system.  This TWC API returns weather forecasts starting current day. 
Forecast Composition and Implementation:
The TWC daily forecast product can contain multiple days of daily forecasts for each location. Each day of a forecast can contain up to (3) "temporal segments" meaning three separate forecasts. For any given forecast day we offer day, night, and a 24-hour forecast (daily summary). Implementing our forecasts requires your applications to perform basic processing in order to properly ingest the forecast data feeds.
The data values in this API are correctly populated into Day, Night, or 24-hour temporal segments. These segments are separate objects in the response.
PLEASE NOTE: The daypart object as well as the temperatureMax field OUTSIDE of the daypart object will appear as null in the API after 3:00pm Local Apparent Time.

HTTP Headers and Data Lifetime - Caching and Expiration
For details on appropriate header values as well as caching and expiration definitions, please see The Weather Company Data | API Common Usage Guide.
Translated Fields:
This TWC API handles the translation of phrases for values of the following data. However, when formatting a request URL a valid language must be passed along.
dayOfWeek
daypartName
moonPhase
narrative
qualifierPhrase
uvDescription
windDirectionCardinal
windPhrase
wxPhraseLong

URL Construction 
Request by Geocode: Required Parameters: geocode, units, language, format, apiKey
https://api.weather.com/v3/wx/forecast/daily/5day?geocode=33.74,-84.39&format=json&units=e&language=en-US&apiKey=yourApiKey
Request by IATA Code: Required Parameters: iataCode, units, language, format, apiKey
https://api.weather.com/v3/wx/forecast/daily/5day?iataCode=DEN&units=e&language=en-US&&format=json&apiKey=yourApiKey 
Request by ICAO Code: Required Parameters: icaoCode, units, language, format, apiKey
https://api.weather.com/v3/wx/forecast/daily/5day?icaoCode=KDEN&units=e&language=en-US&format=json&apiKey=yourApiKey 
Request by Place ID: Required Parameters: placeid, units, language, format, apiKey
https://api.weather.com/v3/wx/forecast/daily/5day?placeid=327145917e06d09373dd2760425a88622a62d248fd97550eb4883737d8d1173b&units=e&language=en-US&format=json&apiKey=yourApiKey 
Request by Postal Key: Required Parameters: postalKey, units, language, format, apiKey
https://api.weather.com/v3/wx/forecast/daily/5day?postalKey=81657:US&units=e&language=en-US&format=json&apiKey=yourApiKey 


Data Elements & Definitions
Note: Field names are sorted alphabetically in the table below for presentation purposes. The table below does not represent the sort order of the API response. 
Field Name
Description
Type
Range
Sample
Nulls Allowed
dayOfWeek
Day of week
[string]
Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
Thursday
N
expirationTimeUtc
Expiration time in UNIX seconds
[epoch]


1369252800
N
moonPhase
Description phrase for the current lunar phase
[string]


Waning Gibbous
N
moonPhaseCode
3 character short code for lunar phases
[string]
WNG, WXC, FQ, WNC, LQ, F, WXG, N
WNG
N
moonPhaseDay
Day number within monthly lunar cycle
[integer]
0 through 29
4
N
moonriseTimeLocal
First moonrise in local time. It reflects daylight savings time conventions.
[ISO]
ISO 8601 - YYYY-MM-DDTHH:MM:SS-NNNN; NNNN=GMT offset
2014-08-20T10:47:59-05:00
Y
moonriseTimeUtc
Moonrise time in UNIX epoch value
[epoch]


1369252800
Y
moonsetTimeLocal
First Moonset in local time. It reflects daylight savings time conventions.
[ISO]
ISO 8601 - YYYY-MM-DDTHH:MM:SS-NNNN; NNNN=GMT offset
2014-08-20T10:47:59-05:00
Y
moonsetTimeUtc
Moonset time in UNIX epoch value
[epoch]


1369252800
Y
narrative
The narrative forecast for the 24-hour period.
[string]


A few thunderstorms possible. Lows overnight in the low 60s.
N
qpf
The forecasted measurable precipitation (liquid or liquid equivalent) during 12 or 24 hour period.
[decimal]


0.06
N
qpfSnow
The forecasted measurable precipitation as snow during the 12 or 24 hour forecast period.
[decimal]


1.3
N
sunriseTimeLocal
The local time of the sunrise. It reflects any local daylight savings conventions. For a few Arctic and Antarctic regions, the Sunrise and Sunset data values may be the same (each with a value of 12:01am) to reflect conditions where a sunrise or sunset does not occur.
[ISO]
ISO 8601 - YYYY-MM-DDTHH:MM:SS-NNNN; NNNN=GMT offset
2014-08-20T10:47:59-05:00
Y
sunriseTimeUtc
Sunrise time in UNIX epoch value
[epoch]


1369252800
Y
sunsetTimeLocal
The local time of the sunset. It reflects any local daylight savings conventions. For a few Arctic and Antarctic regions, the Sunrise and Sunset data values may be the same (each with a value of 12:01am) to reflect conditions where a sunrise or sunset does not occur.
[ISO]
ISO 8601 - YYYY-MM-DDTHH:MM:SS-NNNN; NNNN=GMT offset
2014-08-20T10:47:59-05:00
Y
sunsetTimeUtc
Sunset time in UNIX epoch value
[epoch]


1369252800
Y
temperatureMax
Daily maximum temperature
[integer]


82
Y
temperatureMin
Daily minimum temperature
[integer]


59
N
validTimeUtc
Time forecast is valid in UNIX seconds
[epoch]


1369306800
N
validTimeLocal
Time forecast is valid in local apparent time.
[ISO]
ISO 8601 - YYYY-MM-DDTHH:MM:SS-NNNN; NNNN=GMT offset
2014-08-20T10:47:59-05:00
N


OBJECT: daypart NOTE: For the purposes of this product day(D) = 7am to 7pm and night(N) = 7pm to 7am
cloudCover
Daytime average cloud cover expressed as a percentage.
[integer]
0 - 100
82
Y
dayOrNight
Day or night indicator
[string]
D, N
D
Y
daypartName
The name of a 12 hour daypart not including day names in the first 48 hours.
[string]
Today, Tonight
Today
Y
iconCode
This number is the key to the weather icon lookup. The data field shows the icon number that is matched to represent the observed weather conditions. 
[integer]


26
Y
iconCodeExtend
Code representing full set sensible weather
[integer]


3200
Y
narrative
The narrative forecast for the daytime period.
[string]


A few thunderstorms possible. Lows overnight in the low 60s.
Y
precipChance
Maximum probability of precipitation.
[integer]


20
Y
precipType
Type of precipitation to display with the probability of precipitation (pop) data element.
[string]
rain, snow, precip
rain
Y
qpf
The forecasted measurable precipitation (liquid or liquid equivalent) during the 12 hour forecast period.
[decimal]


0.04
Y
qpfSnow
The forecasted measurable precipitation as snow during the 12 hour forecast period.
[decimal]


5.3
Y
qualifierPhrase
A phrase associated to the qualifier code describing special weather criteria.
[string]


Winds could occasionally gust over 70 mph.
Y
relativeHumidity
The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature. Relative humidity is always expressed as a percentage.
[integer]
0 - 100
83
Y
snowRange
Snow accumulation amount for the 12 hour forecast period.
[decimal]
<1 -  30+
<1, 1-3, 4 - 6
Y
temperature
Feels Like can move from the Heat Index and Wind Chill areas somewhat commonly.  It would occur when the temperature spans across 65 F, where Heat Index is used above that value and Wind Chill is used below that value.
[integer]


81
N
temperatureHeatIndex
An apparent temperature.  It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity. 
Above 65°F, it is set = to the temperature. 
Units - Expressed in fahrenheit when units=e, expressed in celsius when units=m, s, or h.
[integer]


84
N
temperatureWindChill
An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the cold temperatures and wind speed.
Below  65°F, it is set = to the temperature. 
Units - Expressed in fahrenheit when units=e, expressed in celsius when units=m, s, or h.
[integer]


68
N
thunderCategory
The description of probability thunderstorm activity in an area for 12 hour daypart.
0 = "No thunder"; 1 = "Thunder possible"; 2 = "Thunder expected"; 3 = "Severe thunderstorms possible"; 4 = "Severe thunderstorms likely"; 5 = "High risk of severe thunderstorms"
[string]
0 = "No thunder";
1 = "Thunder possible";
2 = "Thunder expected";
3 = "Severe thunderstorms possible";
4 = "Severe thunderstorms likely";
5 = "High risk of severe thunderstorms"
Severe thunderstorms possible
Y
thunderIndex
The enumeration of thunderstorm probability within an area for a 12 hour daypart.
[integer]
0 - 5
3
Y
uvDescription
The UV Index Description which complements the UV Index value by providing an associated level of risk of skin damage due to exposure.

-2 = Not Available, -1 = No Report, 0 to 2 = Low, 3 to 5 = Moderate, 6 to 7 = High, 8 to 10 = Very High, 11 to 16 = Extreme
[string]
Not Available, No Report, Low, Moderate, High, Very High, Extreme
Low
Y
uvIndex
Maximum UV index for the 12 hour forecast period.
[integer]


2
Y
windDirection
Average wind direction in magnetic notation.
[integer]
0 - 359
148
Y
windDirectionCardinal
Average wind direction in cardinal notation.
[string]
N , NNE , NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW, CALM, VAR
SE
Y
windPhrase
The phrase that describes the wind direction and speed for a 12 hour daypart.
[string]


Winds SSE at 5 to 10 mph.
Y
windSpeed
The maximum forecasted wind speed.
The wind is treated as a vector; hence, winds must have direction and magnitude (speed). The wind information reported in the hourly current conditions corresponds to a 10-minute average called the sustained wind speed. Sudden or brief variations in the wind speed are known as “wind gusts” and are reported in a separate data field. Wind directions are always expressed as "from whence the wind blows" meaning that a North wind blows from North to South. If you face North in a North wind the wind is at your face. Face southward and the North wind is at your back.
[integer]


7
Y
wxPhraseLong
Sensible weather phrase
[string]
Hourly sensible weather phrase up to 32 characters.
Heavy Rain/Wind
Y
wxPhraseShort
Sensible weather phrase
[string]
Hourly sensible weather phrase up to 12 characters.
Windy
Y

JSON Sample
// Response Collapsed for Presentation Purposes    
{
            "dayOfWeek": ["Saturday","Sunday"],
            "expirationTimeUtc": [1474132620,1474132620],
            "moonPhase": ["Waning Gibbous","Waning Gibbous"],
            "moonPhaseCode": ["WXG","WXG"],
            "moonPhaseDay": ["10","11"],
            "moonriseTimeLocal": ["2016-09-17T20:30:02-0400","2016-09-18T21:12:36-0400"],
            "moonriseTimeUtc": [1474158602,1474247556 ],
            "moonsetTimeLocal": ["2016-09-17T08:08:29-0400","2016-09-18T09:16:30-0400 ],
            "moonsetTimeUtc": [1474114109,1474204590 ],
            "narrative": ["Mix of sun and clouds. Highs in the upper 80s and lows in the low 70s.","Showers and thunderstorms late. Highs in the upper 80s."],
            "qpf": [0,0.2],
            "qpfSnow": [0,0 ],
            "sunriseTimeLocal": ["2016-09-17T07:21:26-0400","2016-09-18T07:22:05-0400"],
            "sunriseTimeUtc": [1474111286,1474197725 ],
            "sunsetTimeLocal": ["2016-09-17T19:39:03-0400","2016-09-18T19:37:41-0400" ],
            "sunsetTimeUtc": [1474155543,1474241861 ],
            "temperatureMax": [88,88 ],
            "temperatureMin": [70,71 ],
            "validTimeLocal": ["2016-09-17T07:00:00-0400","2016-09-18T07:00:00-0400" ],
            "validTimeUtc": [1474110000,1474196400],
            "daypart": [
                {
                    "cloudCover": [44,63 ],
                    "dayOrNight": ["D","N" ],
                    "daypartName": [ "Today","Tonight" ],
                    "iconCode": [30,29 ],
                    "iconCodeExtend": [3000,2900 ],
                    "narrative": ["A mix of clouds and sun. High 88F. Winds SE at 5 to 10 mph.","Partly cloudy this evening with more clouds for overnight." ],
                    "precipChance": [0,20 ],
                    "precipType": [rain,precip ],
                    "qpf": [0,0 ],
                    "qpfSnow": [0,0 ],
                    "qualifierPhrase": [null,"Slight chance of a rain shower." ],
                    "relativeHumidity": [48,79 ],
                    "snowRange": ["","" ],
                    "temperature": [88,70 ],
                    "temperatureHeatIndex": [90,86 ],
                    "temperatureWindChill": [84,71 ],
                    "thunderCategory": ["No thunder","No thunder" ],
                    "thunderIndex": [0,0 ],
                    "uvDescription": ["Very High","Low" ],
                    "uvIndex": [8,0 ],
                    "windDirection": [136,159 ],
                    "windDirectionCardinal": ["SE","SSE" ],
                    "windPhrase": ["Winds SE at 5 to 10 mph.","Winds light and variable." ],
                    "windSpeed": [7,3 ],
                    "wxPhraseLong": ["Partly Cloudy","Partly Cloudy" ],
                    "wxPhraseShort": ["P Cloudy","P Cloudy"]
                }


