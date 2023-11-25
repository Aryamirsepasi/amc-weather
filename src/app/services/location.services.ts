import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import * as moment from "moment";

export interface Location {
    locationId: number;
    cityName: string;
    country: string;
    latitude: number;
    longitude: number;
}
@Injectable ({
    providedIn: "root"
})
export class LocationService {
    baseURL = "https://api.tomorrow.io/v4/";
    apiKey = "9DywHuMogHCsdGWTT7PLidNLr7gqemQ4";
    constructor(private http: HttpClient) {}

    public locations: Location[] = [
        {
            locationId: 1,
            cityName: "Hamburg",
            country: "Germany",
            latitude: 53.5488,
            longitude: 9.9872,
        },
        {
            locationId: 2,
            cityName: "Dubai",
            country: "United Arab Emirates",
            latitude: 25.0757595,
            longitude:54.9475536,
        },
        {
            locationId: 3,
            cityName: "Tehran",
            country: "Iran",
            latitude: 35.7219,
            longitude: 51.3347,
        },
        {
            locationId: 4,
            cityName: "Erlangen",
            country: "Germany",
            latitude: 49.5897,
            longitude: 11.0120,
        },
        { 
            locationId: 5,
            cityName: "New York, New York",
            country:"United States",
            latitude: 40.6971494,
            longitude: -74.2598666,
        },
        { 
            locationId: 6, 
            cityName: "London",
            country: "United Kingdon",
            latitude: 51.5285582,
            longitude: -0.2416813,
        },
];
public getLocations ( ): Location[] {
    return this.locations;
}
public getLocationId(locationId: number): Location {
    return this.locations [locationId];
}
public fetchLocationData(latlong: any) {
    let params = `location=${latlong}`;
    params += `&timesteps=1h`;
    params += `&units=metric`;
    params +=  `&apikey=${this.apiKey}`;
    params += `&endTime=${moment().add(2, "hours").toISOString()}`;
    params += `&fields=windDirection&fields=humidity&fields=temperature&fields=windSpeed&fields=uvIndex&fields=rainIntensity&fields=temperatureApparent`;

    const httpOptions = {
        headers: new HttpHeaders ( {
            "Content-Type": "application/json",
        }),
    };

    //get authCode
    return this.http.get(`${this.baseURL}timelines?${params}`, httpOptions).toPromise();
}
}
