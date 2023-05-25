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

      'esri/symbols/PictureMarkerSymbol',

      'esri/geometry/Multipoint',

      'esri/geometry/Extent',

      'esri/layers/GraphicsLayer',

      'esri/geometry/Point',

      'esri/Graphic',
    ]).then(
      ([
        webMap,

        MapView,

        PictureMarkerSymbol,

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

            this.layerDivisionGraphic.minScale = 18489297;18489298

            this.layerDivisionGraphic.maxScale = 18389297;

            this.layerSubDivisionGraphic.minScale = 9244648;

            this.layerSubDivisionGraphic.maxScale = 4622324;

            this.layerCMPGraphic.minScale = 2311162;

            this.layerCMPGraphic.maxScale = 70;

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

              //if (this.view.scale == 18489297.737236) { 

              if (this.divisionListData.length > 0) {
                this.layerDivisionGraphic['graphics'].removeAll();
                this.divisionListData.forEach((item) => {
                  let textSymbol = {
                    type: 'text',

                    color: 'red',

                    text: item['divisionCMPCount'],
                  };

                  let picSymbol = new PictureMarkerSymbol(
                    'assets/lightgreenPin.png'
                  );

                  picSymbol.width = '30px';

                  picSymbol.height = '30px';

                  console.log(picSymbol);

                  if (item['point_X'] && item['point_Y']) {
                    let point = new Point({
                      x: item['point_X'],

                      y: item['point_Y'],

                      spatialReference: { wkid: 3857 },
                    });

                    let divgraphicsPic = new Graphic(point, picSymbol);

                    let divgraphics = new Graphic(point, textSymbol);

                    // this.layerDivisionGraphic.addMany([

                    //   divgraphicsPic,

                    //   divgraphics,

                    // ]);

                    this.layerDivisionGraphic.add(divgraphicsPic);

                    this.layerDivisionGraphic.add(divgraphics);

                    //this.layerDivisionGraphic['visible'] = true;

                    //this.layerSubDivisionGraphic['visible'] = false;

                    //this.layerCMPGraphic['visible'] = false;
                  }
                });
              }
              //}

              //subdivision level

              //if (this.view.scale == 9244648.868618) {

              if (this.subDivisionListData.length > 0) {
                this.layerSubDivisionGraphic['graphics'].removeAll();
                this.subDivisionListData.forEach((item) => {
                  console.log('item:::', item);

                  let textSymbol = {
                    type: 'text',

                    color: 'blue',

                    text: item['subDivisionCMPCount'],
                  };

                  let picSymbol = new PictureMarkerSymbol(
                    '../../assets/images/redPin.png'
                  );

                  picSymbol.width = '30px';

                  picSymbol.height = '30px';

                  if (item['point_X'] && item['point_Y']) {
                    let point = new Point({
                      x: item['point_X'],

                      y: item['point_Y'],

                      spatialReference: { wkid: 3857 },
                    });

                    let subdivgraphics = new Graphic(point, textSymbol);

                    let subdivgraphicsPic = new Graphic(point, picSymbol);

                    this.layerSubDivisionGraphic.addMany([
                      subdivgraphics,

                      subdivgraphicsPic,
                    ]);

                    //this.layerDivisionGraphic['visible'] = false;

                    //this.layerSubDivisionGraphic['visible'] = true;

                    //this.layerCMPGraphic['visible'] = false;
                  }
                });
              }
              //}

              //cmp points

              //if (this.view.scale == 2311162.2171545) {

              if (this.cmpData && this.cmpData.length > 0) {
                this.layerCMPGraphic['graphics'].removeAll();
                this.cmpData.forEach((item) => {
                  console.log('item:::', item);

                  let textSymbol = {
                    type: 'text',

                    color: 'green',

                    text: item['prjUid'],
                  };

                  let picSymbol = new PictureMarkerSymbol(
                    '../../assets/images/subdivExtent.png'
                  );

                  picSymbol.width = '30px';

                  picSymbol.height = '30px';

                  if (item['point_X'] && item['point_Y']) {
                    let point = new Point({
                      x: item['point_X'],

                      y: item['point_Y'],

                      spatialReference: { wkid: 3857 },
                    });

                    let cmpgraphics = new Graphic(point, textSymbol);

                    let cmpgraphicsPic = new Graphic(point, picSymbol);

                    this.layerCMPGraphic.addMany([cmpgraphics, cmpgraphicsPic]);

                    //this.layerDivisionGraphic['visible'] = false;

                    //this.layerSubDivisionGraphic['visible'] = false;

                    //this.layerCMPGraphic['visible'] = true;
                  }
                });
              }
              // }
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
