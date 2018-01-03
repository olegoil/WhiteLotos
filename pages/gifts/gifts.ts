import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { GiftsdetailPage } from '../giftsdetail/giftsdetail';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-gifts',
  templateUrl: 'gifts.html',
})
export class GiftsPage {

  gifts: any = [];
  giftsPicLink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider, public loadingCtrl: LoadingController) {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    backendProv.getGifts().then(res => {
      loading.dismiss();
      this.gifts = res;
    }).catch(e => console.log(e));
    this.giftsPicLink = backendProv.giftsPicLink;
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.giftsPicLink + 'pic/' + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  goGiftsDetail(val) {
    this.navCtrl.push(GiftsdetailPage, {gift: val});
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad GiftsPage');
  }

}
