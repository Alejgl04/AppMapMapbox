import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface ColorMarket {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [ number, number ];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss']
})
export class MarkersComponent implements AfterViewInit {

  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [ number,number ] = [-71.62359000179475, 10.598644891335333];
  markerMaps: ColorMarket[] = [];

  constructor() { }
 
  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.getMarkerLocal();
    // const marketHtml: HTMLElement = document.createElement('div');
    // marketHtml.innerHTML = "hola mundo";
    // new mapboxgl.Marker()
    //     .setLngLat( this.center )
    //     .addTo( this.map )
    //     .setPopup(new mapboxgl.Popup().setHTML("<h2>HELP MEEEEEEEEEEEEEEEEEE</h2>")) // add popup

  }

  addMarket(): void {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarket = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat( this.center )
    .addTo( this.map )

    this.markerMaps.push({
      color,
      marker: newMarket
    });
    this.saveMarkerLocal();

    newMarket.on('dragend', () => {
      this.saveMarkerLocal();
    });  

  }

  goToMarker( valueMarker: mapboxgl.Marker ): void {
    console.log(valueMarker.getLngLat())
    this.map.flyTo({
      center: valueMarker.getLngLat()
    });
    
  }

  saveMarkerLocal() {
    const lngLatArray: ColorMarket[] = [];

    this.markerMaps.forEach( element => {
      const color = element.color;
      const { lng, lat } = element.marker!.getLngLat();

      lngLatArray.push({
        color: color,
        center: [ lng, lat]
      });
    });
    localStorage.setItem('markers', JSON.stringify(lngLatArray) );
  }

  getMarkerLocal() {
    if (!localStorage.getItem('markers')) {
      return;
    }
    const lngLatArray: ColorMarket[] = JSON.parse( localStorage.getItem('markers')! );

    lngLatArray.forEach( m => {
      const newMarket = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat( m.center! )
      .addTo( this.map )

      this.markerMaps.push({
        color: m.color,
        marker: newMarket
      }); 
      newMarket.on('dragend', () => {
        this.saveMarkerLocal();
      });  
    });
  }

  removeMarker( i: number ){
    this.markerMaps[i].marker?.remove();
    this.markerMaps.splice( i,1 );
    this.saveMarkerLocal();
  }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }
}
