import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-express',
  templateUrl: 'express.html',
})
export class ExpressPage {

  selexpress: any;
  expressarr: any = [];
  expresses: any = [];
  offices: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider, public loadingCtrl: LoadingController) {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    backendProv.getRituals(this.navParams.get('menue_cat'))
    .then(res => {
      this.expresses = res;
      loading.dismiss();
    })
    .catch();
    
    this.loadOffices();
    
  }

  ionViewDidLoad() {
    
  }

  loadOffices() {
    this.backendProv.getOffices()
    .then(res => {
      this.offices = res;
    })
    .catch();
  }

  goExpressChoice() {
    // console.log('SELSEND '+JSON.stringify(this.expressarr));
    this.navCtrl.push(TabsPage, {selexp: this.expressarr, offices: this.offices, menuecat: this.navParams.get('menue_cat')});
  }

  selExpress(val1, val2) {
    this.selexpress = val1;
    this.expressarr = val2;
  }

}
