import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

import { SpaPage } from '../spa/spa';
import { ModalritualsPage } from '../modalrituals/modalrituals';

@Component({
  selector: 'page-ritualchoice',
  templateUrl: 'ritualchoice.html',
})
export class RitualchoicePage {

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
    // console.log('ionViewDidLoad RitualchoicePage');
  }

  goSpas() {
    this.navCtrl.push(SpaPage, {menue_cat: 185});
  }

  goRituals() {
    this.navCtrl.push(ModalritualsPage);
  }

}
