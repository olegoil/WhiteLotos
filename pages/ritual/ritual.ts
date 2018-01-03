import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, NavParams, ModalController, Slides, Content, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { TimepointsPipe } from '../../pipes/timepoints/timepoints';
import { ProfiledetailsPage } from '../profiledetails/profiledetails';

import { ModalmastersPage } from '../modalmasters/modalmasters';
import { OrderedPage } from '../ordered/ordered';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-ritual',
  templateUrl: 'ritual.html',
})
export class RitualPage {

  @ViewChild('slidesOne') slides: Slides;
  @ViewChild('slidesTwo') slides2: Slides;
  @ViewChild('slidesThree') slides3: Slides;
  @ViewChild('slidesFour') slides4: Slides;
  @ViewChild('slidesFive') slides5: Slides;
  @ViewChild(Content) content: Content;

  profile: any;

  datetoday: any = new Date();

  takedate: any;
  unixtime: any;
  
  masterid: any;
  masterrealid: any;
  mastername: any;
  masterpic: any;
  masterprof: any;
  selritual: any;
  selunixtime: any;
  selwork: any;
  ritualid: any;
  ritualname: any;
  ritualdesc: any;
  ritualinterval: any;
  goodsid: any;
  masterworks: any = 0;
  statusmessage: any;

  currentIndex: any = 0;
  currentIndex2: any = 0;
  currentIndex3: any = 0;

  piclink: any;
  officePicLink: any;

  dates: any = [];
  offices: any = [];
  masters: any = [];
  masterwork: any = [];
  rituals: any = [];
  professions: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public backendProv: BackendProvider, public menuCtrl: MenuController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public tpp: TimepointsPipe, private datePipe: DatePipe, public alertCtrl: AlertController) {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1000);

    backendProv.getProfessions().then(res => {
      this.professions = res;
    }).catch(e => {});

    backendProv.getGoods()
    .then(res => this.goodsid = res[0].goods_id)
    .catch(e => console.log(e));

    backendProv.getProfile()
    .then(res => this.profile = res)
    .catch(e => console.log(e));

    // FROM DB
    this.piclink = backendProv.piclink;
    this.officePicLink = backendProv.officePicLink;
    this.datetoday = backendProv.timezoneAdd((new Date().getTime()/1000).toFixed(0));
    this.datetoday = new Date(this.datetoday * 1000);
    this.datetoday.setHours(0,0,0,0);
    this.takedate = this.datetoday;
    
    backendProv.getDates()
    .then(res => {this.dates = res;})
    .catch(e => console.log(e));

    this.loadOffices();

    this.loadRituals();

    // PRELOAD DATA
    backendProv.loadSchedule();
    backendProv.loadRoom();
    backendProv.loadOrdering();

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
    this.slides3.loop = false;
    this.slides3.pager = false;
    this.slides3.effect = "slide";
    this.slides3.initialSlide = 0;
    this.slides3.slidesPerView = 2;
    this.slides3.spaceBetween = 30;
    this.slides3.centeredSlides = true;
    this.slides.control = this.slides4;
    this.slides4.control = this.slides;
  }

  entryRequest() {
    let entryRequestAS = this.actionSheetCtrl.create({
      title: this.mastername,
      subTitle: this.datePipe.transform(this.takedate, 'dd') + ' ' + this.datePipe.transform(this.takedate, 'MMM') + ' ' + this.tpp.transform(this.selwork),
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
              menueId: this.ritualid,
              menueName: this.ritualname,
              menueCost: 0,
              menueDesc: this.ritualdesc,
              workerId: this.masterrealid,
              workerName: this.mastername,
              workerPic: this.masterpic,
              workerProfession: this.masterprof,
              orderHour: this.selunixtime,
              orderHourName: this.selwork,
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

              // console.log('ORDER RES '+JSON.stringify(res))

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

                this.navCtrl.setRoot(OrderedPage, { dateday: this.datePipe.transform(this.takedate, 'dd'), datemonth: this.datePipe.transform(this.takedate, 'MMMM'), datetime: this.selwork, dateplace: this.selOffice(this.currentIndex), unixtime: this.selunixtime });
                this.navCtrl.popToRoot();
                  
              }
              else if(res[0].orderOK == '5') {
                let alert = this.alertCtrl.create({
                  title: 'Внимание',
                  subTitle: 'Необходимо подтвердить номер телефона в личном кабинете',
                  buttons: [
                    {
                      text: 'Закрыть'
                    },
                    {
                      text: 'Подтвердить',
                      handler: data => {
                        this.navCtrl.push(ProfiledetailsPage, {profile: this.profile[0]});
                      }
                    }
                  ]
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
            e => {console.log('ERROR RES '+e); loading.dismiss();});

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

  checkStatus() {
    if(!this.selritual && this.selritual != 0) {
      this.statusmessage = 'Выберите услугу';
    }
    else if(this.masterwork.length == 0 && this.masterworks > 0 && this.selritual >= 0) {
      this.statusmessage = 'К сожалению данный мастер уже расписан на весь день.';
    }
    else if(this.masterworks == 0 && this.selritual >= 0) {
      this.statusmessage = 'К сожалению на выбранную услугу все мастера заняты.';
    }
    else {
      this.statusmessage = undefined;
    }
  }

  loadRituals() {
    this.backendProv.getRituals(this.navParams.get('menue_cat'))
    .then(res => {
      this.rituals = res;
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
      this.currentIndex3 = this.slides3.initialSlide;
      this.slides.centeredSlides = true;
      this.checkStatus();
      setTimeout(() => {
        this.slides.slideTo(0, 100);
      }, 200);
    })
    .catch();
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

  chooseRitual(val) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();
    this.selritual = val;
    this.content.scrollToBottom(1000);
    for(let i=0;i<this.rituals.length;i++) {
      if(val == this.rituals[i].in_id) {
        this.ritualid = this.rituals[i].menue_id;
        this.ritualinterval = this.rituals[i].menue_interval;
        this.ritualname = this.rituals[i].menue_name;
        this.ritualdesc = this.rituals[i].menue_desc;
      }
    }
    setTimeout(() => {
      this.masterworks = 0;
      this.backendProv.getMasters(this.ritualid, this.ritualinterval*60, this.selOffice(this.currentIndex))
      .then(res => {
        loading.dismiss();
        this.masters = res;
        // initial master
        this.currentIndex3 = this.slides3.initialSlide;
        this.masterid = this.masters[this.currentIndex3].in_id;
        this.masterrealid = this.masters[this.currentIndex3].user_real_id;
        this.mastername = this.masters[this.currentIndex3].user_name;
        this.masterpic = this.masters[this.currentIndex3].user_pic;
        this.masterwork = this.masters[this.currentIndex3].user_work_time.sort();
        this.unixtime = this.masters[this.currentIndex3].unixtime.sort();

        for(let v=0;v<this.masters.length;v++) {
          if(this.masters[v].user_work_time.length > 0) {
            this.masters[v].user_work_time.sort();
            this.masters[v].unixtime.sort();
            this.masterworks++;
          }
          for(let p=0;p<this.professions.length;p++) {
            if(this.masters[v].user_work_pos == this.professions[p].prof_id) {
              this.masters[v].user_prof = this.professions[p].prof_name;
            }
          }
        }

        this.masterprof = this.masters[this.currentIndex3].user_prof;

        this.checkStatus();
        setTimeout(() => {
          this.slides3.slideTo(0, 200);
          this.content.scrollToBottom(1000);
          this.slides3.control = this.slides5;
          this.slides5.control = this.slides3;
          this.slides3.update();
          this.slides5.update();
        }, 200);
      })
      .catch();
    }, 1000);
  }

  masterDetails(val) {
    let masterDetailModal = this.modalCtrl.create(ModalmastersPage, { master: val, mastername: this.mastername, takedate: this.takedate, selwork: this.selwork, dateplace: this.selOffice(this.currentIndex) });
    masterDetailModal.onDidDismiss(data => {
      if(data) {

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
          menueId: this.ritualid,
          menueName: this.ritualname,
          menueCost: 0,
          menueDesc: this.ritualdesc,
          workerId: this.masterrealid,
          workerName: this.mastername,
          workerPic: this.masterpic,
          workerProfession: this.masterprof,
          orderHour: this.backendProv.timezoneSub(data.unixtime),
          orderHourName: data.datetime,
          orderDayName: data.dateday + '.' + data.datemonths + '.' + data.dateyears,
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

            this.navCtrl.setRoot(OrderedPage, data);
            this.navCtrl.popToRoot();
              
          }
          else if(res[0].orderOK == '1') {
            this.backendProv.orderSentRecord(res[0]);
          }
          else if(res[0].orderOK == '5') {
            let alert = this.alertCtrl.create({
              title: 'Внимание',
              subTitle: 'Необходимо подтвердить номер телефона в личном кабинете',
              buttons: [
                {
                  text: 'Закрыть'
                },
                {
                  text: 'Подтвердить',
                  handler: data => {
                    this.navCtrl.push(ProfiledetailsPage, {profile: this.profile[0]});
                  }
                }
              ]
            });
            alert.present();
          }

        },
        e => {console.log(e); loading.dismiss();});

      }
    });
    masterDetailModal.present();
  }

  selWork(work, unix) {
    this.selwork = work;
    this.selunixtime = unix;
  }

  masterChanged() {
    // selected slide visible, others not
    this.currentIndex3 = this.slides3.realIndex;
    this.masterid = this.masters[this.currentIndex3].in_id;
    this.masterrealid = this.masters[this.currentIndex3].user_real_id;
    this.mastername = this.masters[this.currentIndex3].user_name;
    this.masterpic = this.masters[this.currentIndex3].user_pic;
    this.masterprof = this.masters[this.currentIndex3].user_prof;
    this.masterwork = this.masters[this.currentIndex3].user_work_time;
    this.unixtime = this.masters[this.currentIndex3].unixtime;
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
    this.selritual = undefined;
    this.masterworks = 0;
    // selected slide visible, others not
    this.currentIndex = this.slides.realIndex;
    this.selOffice(this.currentIndex);
    this.loadRituals();
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
    this.content.scrollToTop(1000);
    this.masterwork = [];
    this.selritual = undefined;
    this.masterworks = 0;
    this.slides.initialSlide = this.currentIndex;
    this.loadOffices();
    this.loadRituals();
  }

}
