import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-sharedetails',
  templateUrl: 'sharedetails.html',
})
export class SharedetailsPage {

  myid: any = 0;
  sharedetails: any = 0;
  sharelink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider, private socialSharing: SocialSharing) {
    this.myid = backendProv.myid;
    this.sharedetails = backendProv.getShareDetails();
    this.sharelink = backendProv.sharelink;
  }

  sharePromo() {
    this.socialSharing.share('Скачай приложение «Белый Лотос», используя промо-код '+this.myid+' и получи бонусы.', 'Белый Лотос', 'http://www.olegtronics.com/admin/img/icons/whitelotos.png', this.sharelink).then().catch();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SharedetailsPage');
  }

}
