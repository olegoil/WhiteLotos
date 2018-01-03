import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-social',
  templateUrl: 'social.html',
})
export class SocialPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser, public backendProv: BackendProvider) {
  }

  goInstagram() {
    this.iab.create(this.backendProv.groupIG, '_system', {location:'yes'});
  }

  goFacebook() {
    this.iab.create(this.backendProv.groupFB, '_system', {location:'yes'});
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SocialPage');
  }

}
