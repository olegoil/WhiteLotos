import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-service-giftcards-detail',
  templateUrl: 'service-giftcards-detail.html',
})
export class ServiceGiftcardsDetailPage {

  gifts: any = [];
  giftsPicLink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider) {
    this.gifts.push(navParams.get('gift'));
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

  ionViewDidLoad() {
    
  }

}
