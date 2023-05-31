import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Set our map properties
  zoomChange: boolean = true;
  scaleChange: boolean = false;
  // Set our map properties
  zoomChangedEvent() {
    this.zoomChange = true;
    this.scaleChange = false;
  }

  scaleChangedEvent() {
    this.zoomChange = false;
    this.scaleChange = true;
  }
}
