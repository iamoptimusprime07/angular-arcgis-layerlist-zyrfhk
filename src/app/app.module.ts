import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { esriZoomLevelComponent } from './esri-zoom-level/esri-zoom-level.component';
import { esriZoomBasePocComponent } from './zoom-based-poc/zoom-base-poc.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    esriZoomLevelComponent,
    esriZoomBasePocComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
