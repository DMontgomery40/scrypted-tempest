
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



