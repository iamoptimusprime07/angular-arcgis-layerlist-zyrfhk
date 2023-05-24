import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-feature-layer-two',

  templateUrl: './esri-zoom-level.component.html',

  styleUrls: ['./esri-zoom-level.component.css'],
})
export class esriZoomLevelComponent implements OnInit {
  view: any;

  screenWidth: any;

  screenHeight: any;

  divisionListData: any;

  subDivisionListData: any;

  layerDivisionGraphic: any;

  layerSubDivisionGraphic: any;

  cmpData: any;

  layerCMPGraphic: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.esriFunction();

    this.screenWidth = screen.width;

    this.screenHeight = screen.height;

    this.divisionAPIData();

    this.subDivisionAPIData();

    this.cmpAPIData();
  }

  divisionAPIData() {
    this.http.get<any>('assets/division.json').subscribe((divisions) => {
      this.divisionListData = divisions;
    });
  }

  subDivisionAPIData() {
    this.http.get<any>('assets/subdivision.json').subscribe((subDiv) => {
      this.subDivisionListData = subDiv;
    });
  }

  cmpAPIData() {
    this.http.get<any>('assets/cmppoints.json').subscribe((cmpData) => {
      this.cmpData = cmpData;
    });
  }

  esriFunction() {
    loadModules([
      'esri/WebMap',

      'esri/views/MapView',

      'esri/geometry/Multipoint',

      'esri/geometry/Extent',

      'esri/layers/GraphicsLayer',

      'esri/geometry/Point',

      'esri/Graphic',
    ]).then(
      ([
        webMap,

        MapView,

        Multipoint,

        Extent,

        GraphicsLayer,

        Point,

        Graphic,
      ]) => {
        const map = new webMap({
          portalItem: {
            id: '019ea240fdba4ed1b4c73ff6da805e61',

            portal: 'https://bnsf.maps.arcgis.com',
          },
        });

        map.load().then(() => {
          this.view = new MapView({
            map: map,

            container: 'viewDiv',
          });

          map.when(() => {
            this.layerDivisionGraphic = new GraphicsLayer();

            this.layerSubDivisionGraphic = new GraphicsLayer();

            this.layerCMPGraphic = new GraphicsLayer();

            this.view.map.add(this.layerDivisionGraphic);

            this.view.map.add(this.layerSubDivisionGraphic);

            this.view.map.add(this.layerCMPGraphic);

            //'heading-for-map' id is refer as string over here

            this.view.ui.add('heading-for-map', 'top-right');

            let pointExtentList = [
              [-13515012.912491988, 6027451.476803078],
              [-9537841.456758756, 4058433.62817746],
            ];

            let multipoint = new Multipoint(pointExtentList);

            // console.log(multipoint);

            let extent = new Extent({
              xmin: multipoint['extent']['xmin'],

              ymin: multipoint['extent']['ymin'],

              xmax: multipoint['extent']['xmax'],

              ymax: multipoint['extent']['ymax'],

              spatialReference: {
                wkid: 3857,
              },
            });

            this.view.goTo(extent);

            const displayTrac = (event) => {
              //console.log(event.mapPoint);
            };

            const scaleChanged = (event) => {
              //division level
              if (this.view.scale == 18489297.737236) {
                this.layerDivisionGraphic['graphics'].removeAll();
                console.log('division::::');

                this.divisionListData.forEach((item) => {
                  console.log('item:::', item);

                  let textSymbol = {
                    type: 'text',

                    color: 'red',

                    text: item['divisionCMPCount'],
                  };

                  let point = new Point({
                    x: item['point_X'],

                    y: item['point_Y'],

                    spatialReference: { wkid: 3857 },
                  });

                  let divgraphics = new Graphic(point, textSymbol);

                  this.layerDivisionGraphic.add(divgraphics);

                  this.layerDivisionGraphic['visible'] = true;
                  this.layerSubDivisionGraphic['visible'] = false;
                  this.layerCMPGraphic['visible'] = false;
                });
              }

              //subdivision level
              if (this.view.scale == 9244648.868618) {
                this.layerSubDivisionGraphic['graphics'].removeAll();
                this.subDivisionListData.forEach((item) => {
                  console.log('item:::', item);

                  let textSymbol = {
                    type: 'text',

                    color: 'blue',

                    text: item['subDivisionCMPCount'],
                  };

                  let point = new Point({
                    x: item['point_X'],

                    y: item['point_Y'],

                    spatialReference: { wkid: 3857 },
                  });

                  let subdivgraphics = new Graphic(point, textSymbol);

                  this.layerSubDivisionGraphic.add(subdivgraphics);

                  this.layerDivisionGraphic['visible'] = false;
                  this.layerSubDivisionGraphic['visible'] = true;
                  this.layerCMPGraphic['visible'] = false;
                });
              }

              //cmp points
              if (this.view.scale == 2311162.2171545) {
                this.layerCMPGraphic['graphics'].removeAll();
                this.cmpData.forEach((item) => {
                  console.log('item:::', item);

                  let textSymbol = {
                    type: 'text',

                    color: 'green',

                    text: item['prjUid'],
                  };

                  let symbol = new this.pictureMarkerSymbol(
                    '../../assets/Image/subdivExtent.png'
                  );
                  symbol.width = '30px';
                  symbol.height = '30px';

                  let point = new Point({
                    x: item['point_X'],

                    y: item['point_Y'],

                    spatialReference: { wkid: 3857 },
                  });

                  let cmpgraphics = new Graphic(point, textSymbol);

                  this.layerCMPGraphic.add(cmpgraphics);

                  this.layerDivisionGraphic['visible'] = false;
                  this.layerSubDivisionGraphic['visible'] = false;
                  this.layerCMPGraphic['visible'] = true;
                });
              }

              if (this.view.scale < 18489298) {
                console.log('subdivision::::');
              }
            };

            this.view.on('click', displayTrac);

            // this.view.watch('scale', scaleChanged);

            this.view.watch('zoom', scaleChanged);

            if (this.view.scale == 18489297.737236) {
              console.log('division::::');
            }
          });
        });
      }
    );
  }
}