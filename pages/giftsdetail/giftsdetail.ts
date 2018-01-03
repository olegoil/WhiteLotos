import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-giftsdetail',
  templateUrl: 'giftsdetail.html',
})
export class GiftsdetailPage {

  gifts: any = [];
  createdCode: any = null;
  giftsPicLink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider) {
    this.gifts.push(navParams.get('gift'));
    this.giftsPicLink = backendProv.giftsPicLink;
    let newdate = new Date();
    let datetime = Math.round(newdate.getTime() / 1000);
    this.createdCode = this.gifts[0].gifts_id + '&' + backendProv.myid + '&' + datetime + '&' + backendProv.makeid() + '&' + this.gifts[0].gifts_points;
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
    // console.log('ionViewDidLoad GiftsdetailPage');
  }

}
