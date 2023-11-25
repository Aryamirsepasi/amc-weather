import { Component } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { LocationService, Location } from '../services/location.services';
import { DataService, Message } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private location: LocationService) { }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getLocations ( ): Location[] {
    return this.location.getLocations () ;
  }    

}
