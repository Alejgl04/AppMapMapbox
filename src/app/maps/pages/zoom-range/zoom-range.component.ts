import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.scss']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap!: ElementRef
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [ number,number ] = [-71.62359000179475, 10.598644891335333];
  constructor() {}


  ngAfterViewInit(): void {

    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map.getZoom();
    });
    this.map.on('zoomend', (ev) => {
      if ( this.map.getZoom() > 18 ) {
        this.map.zoomTo( 18 );
      }
    });
    this.map.on('move', (event) => {
      const target = event.target;
      const { lng , lat } = target.getCenter();
      this.center = [ lng,lat ];
    });

  }
  
  zoomOut() {
    this.map.zoomOut();

  }

  zoomIn(){
    this.map.zoomIn();
  }

  zoomChanged( value:string ){
    this.map.zoomTo( Number( value ) ); 
  }

  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
    this.map.off('zoomend', () => {});
    this.map.off('move', () => {});
  }
}
