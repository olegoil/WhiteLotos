import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ActionSheetController, LoadingController, Slides } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { TimepointsPipe } from '../../pipes/timepoints/timepoints';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-modalmasters',
  templateUrl: 'modalmasters.html',
})
export class ModalmastersPage {

  @ViewChild('slidesOne') slides: Slides;

  masterwork: any = [];
  master: any;
  piclink: any;
  mastername: any;
  takedate: any;
  selwork: any;
  dateplace: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public backendProv: BackendProvider, public tpp: TimepointsPipe, private datePipe: DatePipe, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController) {
    this.master = this.navParams.get('master');
    this.mastername = this.navParams.get('mastername');
    this.takedate = this.navParams.get('takedate');
    this.dateplace = this.navParams.get('dateplace');
    this.piclink = backendProv.piclink;
  }

  ionViewDidLoad() {
    this.navCtrl.swipeBackEnabled = false;
    this.slides.loop = false;
    this.slides.pager = false;
    this.slides.effect = "slide";
    this.slides.initialSlide = 0;
  }

  showSchedule() {
    this.slides.slideTo(0, 200);
  }

  showInfo() {
    this.slides.slideTo(1, 200);
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/girl3.png';
    }
  }

  entryRequest(selwork, unixtime) {
    let entryRequestAS = this.actionSheetCtrl.create({
      title: this.mastername,
      subTitle: this.datePipe.transform(this.takedate, 'dd') + ' ' + this.datePipe.transform(this.takedate, 'EEE') + ' ' + this.tpp.transform(selwork),
      cssClass: 'action-subtitle',
      buttons: [
        {
          text: 'Записаться',
          handler: () => {
            let data = { dateday: this.datePipe.transform(this.takedate, 'dd'), datemonth: this.datePipe.transform(this.takedate, 'MMMM'), datemonths: this.datePipe.transform(this.takedate, 'MM'), dateyears: this.datePipe.transform(this.takedate, 'y'), datetime: selwork, dateplace: this.dateplace, unixtime: unixtime };
            this.viewCtrl.dismiss(data);
          }
        },
        {
          text: 'Отменить',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    entryRequestAS.present();
  }
  
  goRitual() {
    let data = {
      site: 'ritual'
    }
    this.viewCtrl.dismiss(data);
  }

  goSpa() {
    let data = {
      site: 'spa'
    }
    this.viewCtrl.dismiss(data);
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
