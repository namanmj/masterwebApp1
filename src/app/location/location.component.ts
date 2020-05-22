import { Component, OnInit, AfterViewInit } from '@angular/core';
import { get } from 'scriptjs';
import { Router } from '@angular/router';
declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit  {

  traplocation = true;
  infoWindow;
  map: any;
  postion: any;
  constructor(private router: Router) {
  }
  ngOnInit() {
    this.traplocation = true
    // get("https://maps.googleapis.com/maps/api/js?key=&libraries=places", () => { });
    this.initMap()
    this.changelocinput()
  }
  setpos() {
    this.router.navigateByUrl("/home")
  }
  changelocinput() {
    localStorage.setItem('lat', 'null')
    localStorage.setItem('lng', 'null')
  }
  togglescreen() {
    this.traplocation = !this.traplocation
    const map = new google.maps.Map(document.getElementById("mapselect"), {
      mapTypeControl: false,
      zoom: 12,
      center:{ lat: 28.68627380000001, lng: 77.2217831 }
    });
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    // marker.setVisible(true);
    // marker.setPosition({ lat: 28.68627380000001, lng: 77.2217831 });
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
    marker.setVisible(false);

      if (!place.geometry) {
        document.getElementById('pac-input')['value'] = ''
        localStorage.setItem('lat', 'null')
        localStorage.setItem('lng', 'null')
        return;
      }
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      localStorage.setItem('lat', JSON.parse(JSON.stringify(place.geometry.location))['lat'])
      localStorage.setItem('lng', JSON.parse(JSON.stringify(place.geometry.location))['lng'])
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });
  }
  showTrackingPosition(value) {
    this.postion = value.coords
    localStorage.setItem("lat", this.postion.latitude)
    localStorage.setItem("lng", this.postion.longitude)
    this.router.navigateByUrl('/home')
  }
  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}