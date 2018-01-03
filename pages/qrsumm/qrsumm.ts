import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { QrcodePage } from '../qrcode/qrcode';

@Component({
  selector: 'page-qrsumm',
  templateUrl: 'qrsumm.html',
})
export class QrsummPage {

  expression: any = (0).toFixed(2);
  realexpression: any = 0;
  device_id: any = 1234567890;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.expression = (0).toFixed(2);
    this.realexpression = 0;
  }
  
  addVal(value) {
      if(this.realexpression === "" || this.realexpression === undefined || this.realexpression === 0) {
        this.realexpression = value;
        this.expression = (this.realexpression / 100).toFixed(2);
      }
      else if(this.realexpression.length === undefined || this.realexpression.length <= 7) {
        this.realexpression = this.realexpression + "" + value;
        this.expression = (parseInt(this.realexpression) / 100).toFixed(2);
      }
  }

  removeText() {
      if(this.realexpression != "" && this.realexpression != undefined && this.realexpression != 0 && this.realexpression.length != undefined) {

          if(this.realexpression.length == 1) {
              this.realexpression = 0;
              this.expression = (0).toFixed(2);
          }
          else {
              this.realexpression = this.realexpression.slice(0, -1);
              this.expression = (this.realexpression / 100).toFixed(2);
          }
          
      }
      else {
          this.realexpression = 0;
          this.expression = (0).toFixed(2);
      }
  }

  calcbill = function() {
    
    if(this.realexpression != "" && this.realexpression != '0') {
      this.goQRCode();
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Какая сумма чека?',
        subTitle: 'Укажите сумму чека!',
        buttons: ['Закрыть']
      });
      alert.present();
    }

  }

  goQRCode() {
    this.navCtrl.push(QrcodePage, {
      type: 'points',
      realexpression: this.realexpression,
      device_id: this.device_id,
    });
  }

  add(val) {

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad QrsummPage');
  }

}
