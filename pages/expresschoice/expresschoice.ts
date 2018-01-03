import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController, LoadingController, MenuController, App, AlertController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { TimepointsPipe } from '../../pipes/timepoints/timepoints';

import { ModalmastersPage } from '../modalmasters/modalmasters';
import { OrderedPage } from '../ordered/ordered';
import { ProfiledetailsPage } from '../profiledetails/profiledetails';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-expresschoice',
  templateUrl: 'expresschoice.html',
})
export class ExpresschoicePage {

  masters: any = [];
  selplace: any = 0;
  initval: any = 0;
  offices: any = 0;
  officeid: any = 0;
  grouped: any = [];
  piclink: any;
  takedate: any;
  selwork: any;
  currentIndex: any;
  profile: any;
  menuecat: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public backendProv: BackendProvider, public menuCtrl: MenuController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public tpp: TimepointsPipe, private datePipe: DatePipe, private app: App, public alertCtrl: AlertController) {
    this.offices = this.navParams.get('office');
    this.masters = this.navParams.get('masters');
    // console.log(JSON.stringify(this.masters));
    this.menuecat = this.navParams.get('menuecat');
    this.officeid = this.offices.office_id;
    this.piclink = backendProv.piclink;
    this.groupByDate();
  }

  ionViewDidEnter() {
    this.backendProv.getProfile()
    .then(res => {
      this.profile = res;
    })
    .catch(e => console.log(e));
  }

  compare(a,b) {
    if (a.dayday < b.dayday)
      return -1;
    if (a.dayday > b.dayday)
      return 1;
    return 0;
  }

  entryRequest(val, val2) {
    this.takedate = new Date(val.user_unixtime*1000);
    this.takedate.setHours(0,0,0,0);
    let entryRequestAS = this.actionSheetCtrl.create({
      title: val.user_name,
      subTitle: this.datePipe.transform(this.takedate, 'dd') + ' ' + this.datePipe.transform(this.takedate, 'MMM') + ' ' + this.tpp.transform(val.user_daytime),
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
            loading.dismiss();
            let orderstr = {
              inst_id: this.backendProv.institution,
              newusr: 'calender',
              device_id: this.backendProv.uuid,
              getset: 1,
              menueId: 0,
              menueName: 'Экспресс запись',
              menueCost: 0,
              menueDesc: 'Экспресс запись',
              workerId: val.user_real_id,
              workerName: val.user_name,
              workerPic: val.user_pic,
              workerProfession: val.user_prof,
              orderHour: val.user_unixtime,
              orderHourName: val.user_daytime,
              orderDayName: this.datePipe.transform(this.takedate, 'dd') + '.' + this.datePipe.transform(this.takedate, 'MM') + '.' + this.datePipe.transform(this.takedate, 'y'),
              ordercats: this.menuecat,
              ordgood: 0,
              name: this.profile[0].user_name,
              phone: this.profile[0].user_mob,
              email: this.profile[0].user_email,
              ordoffice: this.officeid,
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
                
                this.app.getRootNav().setRoot(OrderedPage, { dateday: this.datePipe.transform(this.takedate, 'dd'), datemonth: this.datePipe.transform(this.takedate, 'MMMM'), datetime: val.user_daytime, dateplace: this.offices, unixtime: val.user_unixtime });
                  
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
                        this.app.getRootNav().setRoot(ProfiledetailsPage, {profile: this.profile[0]});
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
            e => {
              console.log(e); 
              loading.dismiss();
            });

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

  masterDetails(val, val2) {
    this.takedate = new Date(val.unixtime*1000);
    this.takedate.setHours(0,0,0,0);
    let masterDetailModal = this.modalCtrl.create(ModalmastersPage, { master: val, mastername: val.user_name, takedate: this.takedate, selwork: 0, dateplace: val2 });
    masterDetailModal.onDidDismiss(data => {
      if(data) {
        this.navCtrl.push(OrderedPage, data);
      }
    });
    masterDetailModal.present();
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/girl3.png';
    }
  }

  groupByDate3(val1, val2) {
    let goon = 0;
    if(this.grouped.length > 0) {
      for(let i=0;i<this.grouped.length;i++) {
        if(goon == 0) {
          if(val1.dayday == this.grouped[i].dayday) {
            let newval2 = {
              user_real_id: val2.user_real_id,
              user_pic: val2.user_pic,
              user_name: val2.user_name,
              user_prof: val2.user_prof,
              user_daytime: val1.daytime,
              user_unixtime: val1.unixtime
            }
            this.grouped[i].masters.push(newval2);
            this.grouped.sort(this.compare);
            // console.log(JSON.stringify(this.grouped))
            goon = 1;
          }
          else if(i==this.grouped.length-1 && val1 != this.grouped[i].dayday) {
            let newGroup = {
              dayday: val1.dayday,
              masters: []
            }
            let newval2 = {
              user_real_id: val2.user_real_id,
              user_pic: val2.user_pic,
              user_name: val2.user_name,
              user_prof: val2.user_prof,
              user_daytime: val1.daytime,
              user_unixtime: val1.unixtime
            }
            newGroup.masters.push(newval2);
            this.grouped.push(newGroup);
            this.grouped.sort(this.compare);
            // console.log(JSON.stringify(this.grouped))
            goon = 1;
          }
        }
      }
    }
    else {
      let newGroup = {
        dayday: val1.dayday,
        masters: []
      }
      let newval2 = {
        user_real_id: val2.user_real_id,
        user_pic: val2.user_pic,
        user_name: val2.user_name,
        user_prof: val2.user_prof,
        user_daytime: val1.daytime,
        user_unixtime: val1.unixtime
      }
      newGroup.masters.push(newval2);
      this.grouped.push(newGroup);
      this.grouped.sort(this.compare);
      // console.log(JSON.stringify(this.grouped))
    }
  }

  groupByDate2(val) {
    if(val.user_work_time.length > 0) {
      for(let i=0;i<val.user_work_time.length;i++) {
        this.groupByDate3(val.user_work_time[i], val);
      }
    }
  }

  groupByDate() {
    for(let i=0;i<this.masters.length;i++) {
      this.groupByDate2(this.masters[i]);
    }
  }

  switchPlace(id) {
    this.selplace = id;
  }

  getByDate(date) {
    let master = [];
    if(this.masters.length > 0) {
      for(let i=0;i<this.masters.length;i++) {
        if(this.masters[i].id <= this.navParams.get('test')) {
          master.push(this.masters[i]);
        }
      }
      return master;
    }
    return master;
  }

}
