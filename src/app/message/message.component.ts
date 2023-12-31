import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../services/location.services';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input () location: Location | undefined;

  constructor ( ){}

  ngOnInit () {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
