import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService, Location } from '../services/location.services';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  public location: Location | any;
  public locationData: {} | any ={};

  constructor(
    private locationService: LocationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const locationId: any = this.activatedRoute.snapshot.paramMap.get("id");
    this.location = this.locationService.getLocationId(
      parseInt(locationId, 10)-1
    );
    const latlong = `${this.location["latitude"]},${this.location["longitude"]}`;
    console.log(latlong);  
    this.fetchLocation(latlong);
  }
  async fetchLocation (latlong: any) {
    let locationDataa: any = new Object();
    locationDataa = await(this.locationService.fetchLocationData(latlong));
    console.log(locationDataa);
    this.locationData= locationDataa["data"]["timelines"][0]["intervals"][0]["values"];
  }

  getrainIntensity(){
    let rainin= parseInt(this.locationData.rainIntensity);
    if ( rainin < 0.5){
      return (this.locationData.rainIntensity+" mm/h"+ " No rain");
     }else if (rainin >= 0.5 && rainin < 2 ){
      return (this.locationData.rainIntensity+" mm/h"+ " Week rain");
     }else if (rainin >= 2 && rainin < 6 ){
      return (this.locationData.rainIntensity+" mm/h"+ " Moderate rain");
     }else if (rainin >= 6 && rainin < 10 ){
      return (this.locationData.rainIntensity+" mm/h"+ " Heavy rain");
     }else if (rainin >= 10 && rainin < 18 ){
      return (this.locationData.rainIntensity+" mm/h"+ " Very heavy rain");
     }else if (rainin >= 18 && rainin < 30 ){
      return (this.locationData.rainIntensity+" mm/h"+ " Shower");
     }else return (this.locationData.rainIntensity+" mm/h"+ " Cloudburst");
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }
}
