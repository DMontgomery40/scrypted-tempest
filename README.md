[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/mcp-3d-printer-server/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-green.svg)](https://nodejs.org/en/download/)
[![Downloads](https://img.shields.io/npm/dm/scrypted-tempest.svg)](https://www.npmjs.com/package/scrypted-tempest)

# Tempest (WeatherUnderground) Station Plugin for Scrypted
## Overview
This plugin integrates the Tempest Weather Station with Scrypted, primarily to enable weather-based automations.

⚠️ Pre-Beta State
This plugin is in a very early, pre-beta state. It's published for developers who might want to extend its functionality or create weather-based automations. Use at your own risk.

## Setup

### Intended API Endpoint 
> https://docs.google.com/document/d/1KGb8bTVYRsNgljnNH67AMhckY8AQT2FVwZ9urj8SWBs/edit?tab=t.0

This version of the plugin is intended to only connect with a Weather Underground Token / API key.

If you don't have a PWS (Personal Weather Station), follow the directions here: 

> https://openthings.freshdesk.com/support/solutions/articles/5000017485-getting-a-weather-underground-wu-api-key

(you essentially just "make one up" and get a token)

 If you have a Tempest Weather Station, same instructions apply, although you'll need to register the Tempest Station first. If you've already registered your Tempest Station, you can skip this step and just go here;

> https://www.wunderground.com/signup

Follow the above link to sign up for a free Weather Underground account and generate a token. This token is then used to connect with the Weather Underground API.

## Get the closest Station ID
> If you have a Tempest Station, and have Registered it, you can still use this method, just zoom all the way in on the marker to get the exact Station ID. (This can be more intuiive than finding it through the Tempest App)


To find the Smart Weather Station that will have the most accurate data for your location, follow this link: https://www.wunderground.com/wundermap

Zoom into the map and find the station nearest to you; depending on your region, the exact pieces of the Station ID will very, but it should be in a format similar to  `Station ID: KCODENVE1472` (US), `Station ID: IBADSA12` (German) etc. 



