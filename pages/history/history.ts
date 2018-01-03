import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { TimepointsPipe } from '../../pipes/timepoints/timepoints';

import { ModalmastersPage } from '../modalmasters/modalmasters';
import { OrderedPage } from '../ordered/ordered';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  places: any = [];
  masters: any = [];
  professions: any = [];
  offices: any = [];
  dates: any = [];
  history: any = [];
  services: any = [];
  selplace: any = 0;
  datetoday: any = new Date();
  masterwork: any;
  selwork: any;
  selunixtime: any;
  officeadress: any;
  piclink: any;
  ritualdate: any;
  grouped: any = [];
  takedate: any = new Date();
  profile: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public tpp: TimepointsPipe, private datePipe: DatePipe, public alertCtrl: AlertController, public modalCtrl: ModalController) {

    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    this.loading.present();

    // PRELOAD DATA
    this.backendProv.loadSchedule();
    this.backendProv.loadRoom();
    this.backendProv.loadOrdering();

    this.piclink = this.backendProv.piclink;
    
    this.ritualdate = this.backendProv.timezoneAdd((this.datetoday.getTime()/1000).toFixed(0));
    this.ritualdate = new Date(this.ritualdate * 1000);
    this.ritualdate.setHours(0,0,0,0);

    this.backendProv.getProfile()
    .then(res => {
      this.profile = res;
    })
    .catch(e => console.log('ERROR 1: '+e));

    this.backendProv.getProfessions()
    .then(res => {
      this.professions = res;
    })
    .catch(e => {});

    this.backendProv.getOffices()
    .then(res => {
      this.offices = res;
    })
    .catch(e => console.log('ERROR 2: '+e));

    this.backendProv.getRituals(this.navParams.get('menue_cat'))
    .then(res => {
      this.services = res;
      setTimeout(() => {
        this.backendProv.getHistory()
        .then(res => {
          this.history = res;
          if(this.history.length > 0) {
            if(this.history[0].order_order != 0) {
              this.loadMasters();
              this.lastPlace();
            }
          }
        })
        .catch(e => console.log('ERROR 3: '+e));
      }, 1000);
    })
    .catch();

  }

  ionViewDidEnter() {
    
  }

  selOffice(val) {
    let seloffice;
    for(let i=0;i<this.offices.length;i++) {
      if(val == this.offices[i].office_id) {
        seloffice = this.offices[i];
      }
    }
    return seloffice;
  }

  masterDetails() {
    let master = [{user_pic: this.history[0].order_worker_pic_phone, user_name: this.history[0].order_worker_name_phone, user_prof: this.masters[0].user_prof, user_work_time: [], user_info: this.history[0].order_worker_name_phone}];
    let masterDetailModal = this.modalCtrl.create(ModalmastersPage, { master: master, mastername: this.history[0].order_worker_name_phone, takedate: this.takedate, selwork: 0, dateplace: [] });
    masterDetailModal.onDidDismiss(data => {
      if(data) {
        this.navCtrl.push(OrderedPage, data);
      }
    });
    masterDetailModal.present();
  }

  entryRequest(daytime, unixtime) {
    this.takedate = new Date(unixtime*1000);
    this.takedate.setHours(0,0,0,0);
    let entryRequestAS = this.actionSheetCtrl.create({
      title: this.history[0].order_worker_name_phone,
      subTitle: this.datePipe.transform(this.takedate, 'dd') + ' ' + this.datePipe.transform(this.takedate, 'MMM') + ' ' + this.tpp.transform(daytime),
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
              menueId: this.history[0].order_order,
              menueName: this.history[0].order_name_phone,
              menueCost: 0,
              menueDesc: this.history[0].order_desc,
              workerId: this.history[0].order_worker,
              workerName: this.history[0].order_worker_name_phone,
              workerPic: this.history[0].order_worker_pic_phone,
              workerProfession: this.history[0].order_worker_profession_phone,
              orderHour: unixtime,
              orderHourName: daytime,
              orderDayName: this.datePipe.transform(this.takedate, 'dd') + '.' + this.datePipe.transform(this.takedate, 'MM') + '.' + this.datePipe.transform(this.takedate, 'y'),
              ordercats: this.navParams.get('menue_cat'),
              ordgood: this.history[0].order_goods,
              name: this.profile[0].user_name,
              phone: this.profile[0].user_mob,
              email: this.profile[0].user_email,
              ordoffice: this.history[0].order_office,
              comments: '',
              reminder: '',
              smsconf: ''
            };
            
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

                this.navCtrl.setRoot(OrderedPage, { dateday: this.datePipe.transform(this.takedate, 'dd'), datemonth: this.datePipe.transform(this.takedate, 'MMMM'), datetime: daytime, dateplace: this.selOffice(this.history[0].order_office), unixtime: unixtime });
                this.navCtrl.popToRoot();
                  
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
            e => {console.log('ERROR 4: '+e); loading.dismiss();});

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

  loadMasters() {

    let userid = this.history[0].order_worker;
    if(this.history[0].order_worker == 0) {
      userid = '-';
    }
    let limit = 0;
    let interval = 3600;
    if(this.services.length > 0) {
      for(let i=0;i<this.services.length;i++) {
        if(this.services[i].menue_id == this.history[0].order_order) {
          interval = this.services[i].menue_interval*60;
        }
      }
    }

    let office = this.offices;
    if(this.offices.length > 0) {
      for(let i=0;i<this.offices.length;i++) {
        if(this.offices[i].office_id == this.history[0].order_office) {
          office = [];
          office.push(this.offices[i]);
        }
      }
    }

    this.backendProv.getMastersHist(this.history[0].order_order, interval, office, userid, limit)
    .then(res => {
      this.masters = res;
      if(this.masters.length > 0) {
        for(let v=0;v<this.masters.length;v++) {
          for(let p=0;p<this.professions.length;p++) {
            if(this.masters[v].user_work_pos == this.professions[p].prof_id) {
              this.masters[v].user_prof = this.professions[p].prof_name;
            }
          }
        }
      }
      this.groupByDate();
      this.loading.dismiss();
    })
    .catch(e => {
      console.log('ERRRROR '+JSON.stringify(e));
    });

  }

  checkPic(val) {
    if(val && val != '0' && val != 'user.png') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/girl3.png';
    }
  }

  selWork(work, unixtime) {
    this.selwork = work;
    this.selunixtime = unixtime;
  }

  lastPlace() {
    // lastplace
    for(let i=0;i<this.offices.length;i++) {
      if(this.offices[i].office_id == this.history[0].order_office) {
        this.officeadress = this.offices[i].office_adress;
      }
    }
  }

  groupByDate3(mastersworktime) {
    let goon = 0;
    if(this.grouped.length > 0) {
      for(let i=0;i<this.grouped.length;i++) {
        if(goon == 0) {
          if(mastersworktime.dayday == this.grouped[i].dayday) {
            let masterunix = mastersworktime;
            let groupedi = this.grouped[i];
            for(let k=0;k<groupedi.times.length;k++) {
              if(goon==0) {
                if(groupedi.times.user_unixtime == masterunix.unixtime) {
                  goon = 1;
                }
                else if(k==groupedi.times.length-1) {
                  let time = {
                    user_daytime: masterunix.daytime,
                    user_unixtime: masterunix.unixtime
                  }
                  groupedi.times.push(time);
                  goon = 1;
                }
              }
            }
          }
          else if(i==this.grouped.length-1 && goon==0) {
            let newGroup = {
              dayday: mastersworktime.dayday,
              times: []
            }
            let newval2 = {
              user_daytime: mastersworktime.daytime,
              user_unixtime: mastersworktime.unixtime
            }
            newGroup.times.push(newval2);
            this.grouped.push(newGroup);
            goon = 1;
          }
        }
      }
      // setTimeout(() => {console.log(JSON.stringify(this.grouped))}, 500)
    }
    else {
      let newGroup = {
        dayday: mastersworktime.dayday,
        times: []
      }
      let times = {
        user_daytime: mastersworktime.daytime,
        user_unixtime: mastersworktime.unixtime
      }
      newGroup.times.push(times);
      this.grouped.push(newGroup);
    }
  }

  groupByDate2(masters) {
    if(masters.user_work_time.length > 0) {
      for(let i=0;i<masters.user_work_time.length;i++) {
        this.groupByDate3(masters.user_work_time[i]);
      }
    }
  }

  groupByDate() {
    if(this.masters.length > 0) {
      for(let i=0;i<this.masters.length;i++) {
        this.groupByDate2(this.masters[i]);
        if(i==this.masters.length-1) {
          setTimeout(() => {
            // this.grouped;
            if(this.grouped.length > 0) {
              for(let j=0;j<this.grouped.length;j++) {
                this.grouped[j].times;
              }
            }
          }, 1000);
        }
      }
    }
  }

}
