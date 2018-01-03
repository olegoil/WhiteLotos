import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SharedetailsPage } from '../sharedetails/sharedetails';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

  shares: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider) {
    backendProv.getShare().then(res => {this.shares = res;}).catch(e => console.log(e));
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SharePage');
  }

  goShareDetails() {
    this.navCtrl.push(SharedetailsPage);
  }

}
