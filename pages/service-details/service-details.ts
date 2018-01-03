import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-service-details',
  templateUrl: 'service-details.html',
})
export class ServiceDetailsPage {

  services: any = [];
  menuePicLink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider) {
    this.services.push(navParams.get('ritual'));
    this.menuePicLink = backendProv.menuePicLink;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ServiceDetailsPage');
  }

  priceConvert(val) {
    return (val/100).toFixed(2);
  }
  
  checkPic(val) {
    if(val && val != '0') {
      return this.menuePicLink + '300/' + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }
  
  mkOrder(id) {
    
  }

}
