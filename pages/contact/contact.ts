import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  lat: number = 53.8991;
  lon: number = 27.5546;
  zoom: number = 14;
  cluster: any = 0;
  latlons: any;
  screenheight: number = 0;
  offices: any = [];

  constructor(public navCtrl: NavController, public platform: Platform, public backendProv: BackendProvider, private iab: InAppBrowser, public loadingCtrl: LoadingController) {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    this.screenheight = platform.height()/2;
    backendProv.getOffices().then(res => {
      loading.dismiss();
      this.offices = res;
    })
    .catch(e => console.log(e));
  }

  ionViewDidLoad() {

  }

  goMail() {
    this.iab.create('mailto:whitelotus2@mail.ru', '_system', {location:'yes'});
  }

  call() {
    this.iab.create('tel:7579', '_system', {location:'yes'});
  }

  goPath(val) {
    if(val == '0') {
      this.iab.create('https://maps.google.com?saddr=Current+Location&daddr=vulica+Kirava+9+Minsk', '_system', {location:'yes'});
    }
    else if(val == '1') {
      this.iab.create('https://maps.google.com?saddr=Current+Location&daddr=vulica+Kiryly+i+Miafodzija+8+Minsk', '_system', {location:'yes'});
    }
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  strToNum(x) {
    return parseFloat(x);
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return (d).toFixed(2);
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  // getMyPos() {
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     let lat = resp.coords.latitude
  //     let lon = resp.coords.longitude
  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  // }

  // getFreshData() {
  //   this.http.get("http://www.olegtronics.com/GATEMP/someinfo.json")
  //   .map(response => {
  //     this.latlons = response.json();
  //   });
  // }

}
