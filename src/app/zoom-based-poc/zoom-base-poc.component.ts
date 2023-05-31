import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-zoom-base-poc',
  templateUrl: './zoom-base-poc.component.html',
  styleUrls: ['./zoom-base-poc.component.css'],
})
export class esriZoomBasePocComponent implements OnInit {
  view: any;
  screenWidth: any;

  screenHeight: any;

  divisionListData: any;

  subDivisionListData: any;

  layerDivisionGraphic: any;

  layerSubDivisionGraphic: any;

  cmpData: any;

  layerCMPGraphic: any;

  math = Math;

  OnScreenLoadScale: any;

  test: any;
  isRightArrowButton: boolean = true;
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

      'esri/widgets/ScaleBar',
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

        ScaleBar,
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
            //0 - 4 division
            //5 - 6 subdivision
            //7 and above CMP points
            this.layerDivisionGraphic = new GraphicsLayer();

            this.layerSubDivisionGraphic = new GraphicsLayer();

            this.layerCMPGraphic = new GraphicsLayer();

            this.view.map.add(this.layerDivisionGraphic);

            this.view.map.add(this.layerSubDivisionGraphic);

            this.view.map.add(this.layerCMPGraphic);

            //'heading-for-map' id is refer as string over here

            this.view.ui.add('heading-for-map', 'top-right');

            let pointExtentList = [
              [-13515012.912491988, 6027451.476803078],

              [-9537841.456758756, 4058433.62817746],
            ];

            let multipoint = new Multipoint(pointExtentList);

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

            const displayTrac = (event) => {};

            const scaleChanged = (newValue) => {
              //division level

              //less than 5
              console.log('newValue:::', newValue);

              if (this.divisionListData?.length > 0 && newValue < 5) {
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

                  //console.log(picSymbol);

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

                    this.layerDivisionGraphic['visible'] = true;

                    this.layerSubDivisionGraphic['visible'] = false;

                    this.layerCMPGraphic['visible'] = false;
                  }
                });
              }

              //subdivision level

              //5 to 6

              if (
                this.subDivisionListData.length > 0 &&
                newValue >= 5 &&
                newValue < 7
              ) {
                this.layerSubDivisionGraphic['graphics'].removeAll();

                this.subDivisionListData.forEach((item) => {
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

                    this.layerDivisionGraphic['visible'] = false;

                    this.layerSubDivisionGraphic['visible'] = true;

                    this.layerCMPGraphic['visible'] = false;
                  }
                });
              }

              //}

              //cmp points

              //7 and above

              if (this.cmpData && this.cmpData.length > 0 && newValue >= 7) {
                this.layerCMPGraphic['graphics'].removeAll();

                this.cmpData.forEach((item) => {
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

                    this.layerDivisionGraphic['visible'] = false;

                    this.layerSubDivisionGraphic['visible'] = false;

                    this.layerCMPGraphic['visible'] = true;
                  }
                });
              }
            };

            this.view.on('click', displayTrac);

            // this.view.watch('scale', scaleChanged);

            this.view.watch('zoom', scaleChanged);

            //To show the scale of map

            let scaleBar = new ScaleBar({
              view: this.view,

              unit: 'metric',
            });

            this.view.ui.add(scaleBar, {
              position: 'bottom-left',
            });

            this.view.ui.move('zoom', 'bottom-right');
          });
        });
      }
    );
  }

  onClose() {
    this.isRightArrowButton = !this.isRightArrowButton;
  }
}
