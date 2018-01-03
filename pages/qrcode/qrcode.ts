import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
// import { NgxQRCodeModule } from 'ngx-qrcode2';

import { BackendProvider } from '../../providers/backend/backend';
import { ReviewPage } from '../review/review';

@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {

  createdCode: any = null;
  realexpression: any = (0).toFixed(2);

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider, public modalCtrl: ModalController, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    let newdate = new Date();
    let datetime = Math.round(newdate.getTime() / 1000);

    this.createdCode = this.navParams.get('uuid') + '&' + datetime + '&' + this.backendProv.makeid() + '&' + this.navParams.get('realexpression') + '&';
    this.realexpression = this.navParams.get('realexpression');
    this.realexpression = (this.realexpression / 100).toFixed(2);
  }

  goBack() {
    this.navCtrl.pop();
  }

  reviewAsk() {

    let alert = this.alertCtrl.create({
      title: 'Оставить отзыв',
      message: 'Хотите оставить отзыв?',
      buttons: [
        {
          text: 'Нет',
          role: 'cancel',
          handler: () => {
            this.navCtrl.popToRoot();
          }
        },
        {
          text: 'Да',
          handler: () => {
            this.openReview();
          }
        }
      ]
    });
    alert.present();

  }

  openReview() {
    let reviewModal = this.modalCtrl.create(ReviewPage, {});
    reviewModal.onDidDismiss(data => {
      if(data.goroot) {
        this.navCtrl.popToRoot();
      }
    });
    reviewModal.present();
  }

}
