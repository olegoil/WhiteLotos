import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { ServiceDetailsPage } from '../service-details/service-details';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-service-rituals',
  templateUrl: 'service-rituals.html',
})
export class ServiceRitualsPage {

  rituals: any = [];
  menuePicLink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider, public loadingCtrl: LoadingController) {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    backendProv.getRituals('182')
    .then(res => {
      this.rituals = res;
      loading.dismiss();
    })
    .catch(e => console.log(e));
    this.menuePicLink = backendProv.menuePicLink;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ServiceRitualsPage');
  }

  priceConvert(val) {
    return (val/100).toFixed(0);
  }
  
  checkPic(val) {
    if(val && val != '0') {
      return this.menuePicLink + '300/' + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  goRitualDetails(val) {
    this.navCtrl.push(ServiceDetailsPage, {ritual: val});
  }

}
