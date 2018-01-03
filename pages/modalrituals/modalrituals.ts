import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

import { RitualPage } from '../ritual/ritual';
import { ExpressPage } from '../express/express';
import { HistoryPage } from '../history/history';

@Component({
  selector: 'page-modalrituals',
  templateUrl: 'modalrituals.html',
})
export class ModalritualsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController) {
    // let loading = this.loadingCtrl.create({
    //   spinner: 'crescent',
    //   cssClass: 'loader'
    // });
    // loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    // }, 2000);
  }

  ionViewDidLoad() {
    
  }
  
  goHistory() {
    this.navCtrl.push(HistoryPage, {menue_cat: 182});
  }

  goExpress() {
    this.navCtrl.push(ExpressPage, {menue_cat: 182});
  }

  goRitual() {
    this.navCtrl.push(RitualPage, {menue_cat: 182});
  }

}
