import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, NavParams, ModalController, Slides, Content, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { TimepointsPipe } from '../../pipes/timepoints/timepoints';

import { ModalmastersPage } from '../modalmasters/modalmasters';
import { Ordered2Page } from '../ordered2/ordered2';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-spa',
  templateUrl: 'spa.html',
})
export class SpaPage {

  @ViewChild('slidesOne') slides: Slides;
  @ViewChild('slidesTwo') slides2: Slides;
  @ViewChild('slidesFour') slides4: Slides;
  @ViewChild(Content) content: Content;

  profile: any;

  datetoday: any = new Date();

  takedate: any;
  
  masterid: any;
  mastername: any;
  selspa: any;
  selunixtime: any;
  selwork: any;
  spaid: any;
  spaname: any;
  spadesc: any;
  spainterval: any;
  goodsid: any;
  masterworks: any = 0;
  statusmessage: any;

  currentIndex: any = 0;
  currentIndex2: any = 0;
  // currentIndex3: any = 0;

  piclink: any;
  officePicLink: any;

  dates: any = [];
  offices: any = [];
  masters: any = [];
  masterwork: any = [];
  spas: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public backendProv: BackendProvider, public menuCtrl: MenuController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public tpp: TimepointsPipe, private datePipe: DatePipe, public alertCtrl: AlertController) {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1000);

    // FROM DB
    this.piclink = backendProv.piclink;
    this.officePicLink = backendProv.officePicLink;
    this.datetoday = backendProv.timezoneAdd((new Date().getTime()/1000).toFixed(0));
    this.datetoday = new Date(this.datetoday * 1000);
    this.datetoday.setHours(0,0,0,0);
    this.takedate = this.datetoday;
    this.selunixtime = (this.takedate.getTime()/1000).toFixed(0);
    
    backendProv.getDates()
    .then(res => {this.dates = res;})
    .catch(e => console.log(e));

    this.loadOffices();

    this.loadSpas();

    backendProv.getProfile()
    .then(res => this.profile = res)
    .catch(e => console.log(e));

    backendProv.getGoods()
    .then(res => this.goodsid = res[0].goods_id)
    .catch(e => console.log(e));
    
  }

  ionViewDidLoad() {
    this.navCtrl.swipeBackEnabled = false;
    // READY SLIDE SETTS
    this.slides.loop = false;
    this.slides.pager = false;
    this.slides.effect = "slide";
    this.slides.initialSlide = 0;
    this.slides.centeredSlides = true;
    this.slides.slidesPerView = 2;
    this.slides.spaceBetween = 30;
    this.slides2.loop = false;
    this.slides2.pager = false;
    this.slides2.effect = "slide";
    this.slides2.initialSlide = 0;
    this.slides2.centeredSlides = false;
    this.slides2.slidesPerView = 7;
    this.slides2.spaceBetween = 30;
    // this.slides3.loop = false;
    // this.slides3.pager = false;
    // this.slides3.effect = "slide";
    // this.slides3.initialSlide = 0;
    // this.slides3.slidesPerView = 2;
    // this.slides3.spaceBetween = 30;
    // this.slides3.centeredSlides = true;
    this.slides.control = this.slides4;
    this.slides4.control = this.slides;
  }

  entryRequest() {
    let entryRequestAS = this.actionSheetCtrl.create({
      title: 'Записаться?',
      subTitle: this.datePipe.transform(this.takedate, 'dd') + ' ' + this.datePipe.transform(this.takedate, 'MMM'),
      cssClass: 'action-subtitle',
      buttons: [
        {
          text: 'Записаться',
          handler: () => {

            let loading = this.loadingCtrl.create({
              spinner: 'crescent',
              cssClass: 'loader'
            });
            loading.present();

            let orderstr = {
              inst_id: this.backendProv.institution,
              newusr: 'calender',
              device_id: this.backendProv.uuid,
              getset: 1,
              menueId: this.spaid,
              menueName: this.spaname,
              menueCost: 0,
              menueDesc: this.spadesc,
              workerId: 0,
              workerName: 0,
              workerPic: 0,
              workerProfession: 0,
              orderHour: this.backendProv.timezoneSub(this.selunixtime),
              orderHourName: 0,
              orderDayName: this.datePipe.transform(this.takedate, 'dd') + '.' + this.datePipe.transform(this.takedate, 'MM') + '.' + this.datePipe.transform(this.takedate, 'y'),
              ordercats: this.navParams.get('menue_cat'),
              ordgood: this.goodsid,
              name: this.profile[0].user_name,
              phone: this.profile[0].user_mob,
              email: this.profile[0].user_email,
              ordoffice: this.selOffice(this.currentIndex).office_id,
              comments: '',
              reminder: '',
              smsconf: ''
            };
            // console.log('ORDER: '+JSON.stringify(orderstr));
            this.backendProv.httpRequest(JSON.stringify(orderstr))
            .subscribe(res => {

              loading.dismiss();

              if(res[0].orderOK == '3') {
                let alert = this.alertCtrl.create({
                  title: 'Внимание',
                  subTitle: 'Повторный запрос только через 5 минут!',
                  buttons: ['Закрыть']
                });
                alert.present();
              }
              else if(res[0].orderOK == '2') {
                let alert = this.alertCtrl.create({
                  title: 'Внимание',
                  subTitle: 'Вы уже записались на выбранную услугу либо на выбранное время. Ожидайте одобрения или звонка!',
                  buttons: ['Закрыть']
                });
                alert.present();
              }
              else if(res[0].orderOK == '1') {
  
                this.backendProv.orderSentRecord(res[0]);

                this.navCtrl.setRoot(Ordered2Page, { dateday: this.datePipe.transform(this.takedate, 'dd'), datemonth: this.datePipe.transform(this.takedate, 'MMMM'), dateplace: this.selOffice(this.currentIndex), unixtime: this.selunixtime });
                this.navCtrl.popToRoot();
                  
              }
              else if(res[0].orderOK == '1') {
                this.backendProv.orderSentRecord(res[0]);
              }
              else if(res[0].orderOK == '5') {
                let alert = this.alertCtrl.create({
                  title: 'Внимание',
                  subTitle: 'Укажите Ваш номер телефона!',
                  buttons: ['Закрыть']
                });
                alert.present();
              }
              else if(res[0].orderOK == '8') {
                let alert = this.alertCtrl.create({
                  title: 'Внимание',
                  subTitle: 'Нет свободной комнаты!',
                  buttons: ['Закрыть']
                });
                alert.present();
              }
              else if(res[0].orderOK == '9') {
                let alert = this.alertCtrl.create({
                  title: 'Внимание',
                  subTitle: 'Нет свободной комнаты!',
                  buttons: ['Закрыть']
                });
                alert.present();
              }
              
            },
            e => {console.log(e); loading.dismiss();});
            
          }
        },
        {
          text: 'Отменить',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    entryRequestAS.present();
  }

  checkStatus() {
    if(!this.selspa && this.selspa != 0) {
      this.statusmessage = 'Выберите услугу';
    }
    else if(this.masterwork.length == 0 && this.masterworks > 0 && this.selspa >= 0) {
      this.statusmessage = 'К сожалению данный мастер уже расписан на весь день.';
    }
    else if(this.masterworks == 0 && this.selspa >= 0) {
      this.statusmessage = 'К сожалению на выбранную услугу все мастера заняты.';
    }
    else {
      this.statusmessage = undefined;
    }
  }

  loadSpas() {
    this.backendProv.getRituals(this.navParams.get('menue_cat'))
    .then(res => {
      this.spas = res;
      this.checkStatus();
    })
    .catch();
  }

  loadOffices() {
    this.backendProv.getOffices()
    .then(res => {
      this.offices = res;
      // initial Slide visible
      this.currentIndex = this.slides.initialSlide;
      this.currentIndex2 = this.slides2.initialSlide;
      // this.currentIndex3 = this.slides3.initialSlide;
      this.slides.centeredSlides = true;
      this.checkStatus();
      setTimeout(() => {
        this.slides.slideTo(0, 100);
      }, 200);
    })
    .catch();
  }

  chooseSpa(val) {
    this.selspa = val;
    for(let i=0;i<this.spas.length;i++) {
      if(val == this.spas[i].in_id) {
        this.spaid = this.spas[i].menue_id;
        this.spaname = this.spas[i].menue_name;
        this.spadesc = this.spas[i].menue_desc;
      }
    }
    this.content.scrollToBottom(1000);
  }

  recalcPhone(tel) {
    if (!tel) { return ''; }
    var value = tel.toString().trim().replace(/^\+/, '');
    if (value.match(/[^0-9]/)) {
        return tel;
    }
    var country, city, number;
    switch (value.length) {
        case 10: // +1PPP####### -> C (PPP) ###-####
            country = 1;
            city = value.slice(0, 3);
            number = value.slice(3);
            break;

        case 11: // +CPPP####### -> CCC (PP) ###-####
            country = value[0];
            city = value.slice(1, 4);
            number = value.slice(4);
            break;

        case 12: // +CCCPP####### -> CCC (PP) ###-####
            country = value.slice(0, 3);
            city = value.slice(3, 5);
            number = value.slice(5);
            break;

        case 13: // +CCCPP####### -> CC (PPP) ###-####
            country = value.slice(0, 2);
            city = value.slice(2, 5);
            number = value.slice(5);
            break;

        default:
            return tel;
    }
    if (country == 1) {
        country = "";
    }
    number = number.slice(0, 3) + '-' + number.slice(3);
    return (country + " (" + city + ") " + number).trim();
  }

  formatBusHours(val) {
    return val.slice(0,2) + ':' + val.slice(2,4) + '-' + val.slice(4,6) + ':' + val.slice(6,8);
  }

  recalcBusHours(val) {
    let valold = '';
    let startday = '';
    let endday = '';
    let valfinal = [];
    let days= ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    for(let i=0;i<val.length;i++) {
      if(valold == val[i]) {
        endday = ' - '+days[i];
        if(i==val.length-1) {
          valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
        }
      }
      else {
        if(startday != '') {
          valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
          startday = days[i];
          endday = '';
          valold = val[i];
          if(i==val.length-1) {
            valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
          }
        }
        else {
          startday = days[i];
          valold = val[i];
          if(i==val.length-1) {
            valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
          }
        }
      }
    }
    return valfinal;
  }

  selOffice(val) {
    let seloffice;
    for(let i=0;i<this.offices.length;i++) {
      if(val == this.offices[i].in_id) {
        seloffice = this.offices[i];
      }
    }
    return seloffice;
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/girl3.png';
    }
  }

  checkPicComp(val) {
    if(val && val != '0') {
      return this.officePicLink + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  masterDetails() {
    let masterDetailModal = this.modalCtrl.create(ModalmastersPage, {master: this.masterid});
    masterDetailModal.onDidDismiss(data => {});
    masterDetailModal.present();
  }

  selWork(work) {
    this.selwork = work;
  }

  masterChanged() {
    // selected slide visible, others not
    // this.currentIndex3 = this.slides3.realIndex;
    // this.masterid = this.masters[this.currentIndex3].in_id;
    // this.mastername = this.masters[this.currentIndex3].user_name;
    // this.masterwork = this.masters[this.currentIndex3].user_work_time;
  }

  officeChanged() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
    this.masterwork = [];
    this.selspa = undefined;
    this.masterworks = 0;
    // selected slide visible, others not
    this.currentIndex = this.slides.realIndex;
    this.selOffice(this.currentIndex);
    this.loadSpas();
  }

  toggleDate(dat) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
    this.takedate = dat;
    this.selunixtime = (this.takedate.getTime()/1000).toFixed(0);
    this.content.scrollToTop(1000);
    this.masterwork = [];
    this.selspa = undefined;
    this.masterworks = 0;
    this.slides.initialSlide = this.currentIndex;
    this.loadOffices();
    this.loadSpas();
  }

}
