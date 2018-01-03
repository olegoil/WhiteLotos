import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-newsdetail',
  templateUrl: 'newsdetail.html',
})
export class NewsdetailPage {

  news: any = [];
  newsPicLink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider) {
    this.news.push(this.navParams.get('news'));
    this.newsPicLink = backendProv.newsPicLink;
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.newsPicLink + 'pic/' + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewsdetailPage');
  }

}
