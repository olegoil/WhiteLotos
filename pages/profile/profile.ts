import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { ProfiledetailsPage } from '../profiledetails/profiledetails';
import { DatePipe } from '@angular/common';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  piclink: any = 0;
  promobtn: any = 0;
  profiles: any = [];
  visited: any = [];
  ordersAll: any = [];
  menuePicLink: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public backendProv: BackendProvider, public loadingCtrl: LoadingController, private datePipe: DatePipe, public alertCtrl: AlertController) {

    this.piclink = backendProv.piclink;
    this.menuePicLink = backendProv.menuePicLink;

    backendProv.getHistory()
    .then(res => {
      if(res) {
        this.visited = this.datePipe.transform(res[0].order_start*1000, 'dd') + '.' + this.datePipe.transform(res[0].order_start*1000, 'MM') + '.' + this.datePipe.transform(res[0].order_start*1000, 'y');
      }
    })
    .catch(e => console.log(e));

    backendProv.getOrders()
    .then(res => {
      if(res) {
        this.ordersAll = res;
      }
    })
    .catch(e => console.log(e));

  }

  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();
    this.backendProv.getProfile()
    .then(res => {
      loading.dismiss();
      this.profiles = res;
      this.promobtn = res[0].user_promo;
    })
    .catch(e => console.log(e));
  }

  beforeCancelOrder(val) {
    let alert = this.alertCtrl.create({
      title: 'Внимание',
      message: 'Отменить запись?',
      buttons: [{
        text: 'Да',
        role: 'cancel',
        handler: data => {
          this.backendProv.cancelOrder(val)
          .then(res => {

            this.backendProv.getOrders()
            .then(res => {
              if(res) {
                this.ordersAll = res;
              }
            })
            .catch(e => console.log(e));

          })
          .catch(e => console.log(e));
        }
      },
      {
        text: 'Закрыть',
        handler: data => {
          
        }
      }]
    });
    alert.present();
  }

  formatTime(val) {
    return this.backendProv.formatTime(val);
  }

  promoSend(promo) {
    
    this.backendProv.httpRequest(promo)
    .subscribe(res => {

      let promoOk = parseInt(res[0].promoOK);

      if(promoOk == 0) {

        let alert = this.alertCtrl.create({
          title: 'Внимание',
          subTitle: 'Обратитесь в техподдержку.',
          buttons: ['Закрыть']
        });
        alert.present();

      }
      else if(promoOk > 3) {

        this.backendProv.promoConfirm(res);

        this.promobtn = promoOk;

        let alert = this.alertCtrl.create({
          title: 'Благодарим',
          subTitle: 'Промокод внесен верно!',
          buttons: ['Закрыть']
        });
        alert.present();

      }
      else if(promoOk == 2) {

        this.backendProv.promoConfirm(res);

        let alert = this.alertCtrl.create({
          title: 'Внимание',
          subTitle: 'Доступ к данной услуге был закрыт.',
          buttons: ['Закрыть']
        });
        alert.present();

      }
      else if(promoOk == 3) {

        let alert = this.alertCtrl.create({
          title: 'Внимание',
          subTitle: 'Неверно внесенный промокод!',
          buttons: [{
            text: 'Еще раз',
            handler: data => {
              this.enterPromo();
            }
          }]
        });
        alert.present();

      }
    }, e => console.log(e));
  }

  enterPromo() {
    if(this.profiles[0].user_work_pos > '1') {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Доступ к данной услуге был закрыт.',
        buttons: ['Закрыть']
      });
      alert.present();
    }
    else if(this.profiles[0].user_mob_confirm == '1') {
      let prompt = this.alertCtrl.create({
        title: 'Промокод',
        message: "Введите промокод друга",
        inputs: [
          {
            name: 'promo',
            placeholder: '12345'
          },
        ],
        buttons: [
          {
            text: 'Отмена',
            handler: data => {
              // console.log(JSON.stringify(data))
            }
          },
          {
            text: 'Принять',
            handler: data => {
              let promo = JSON.stringify({
                device_id: this.backendProv.uuid,
                inst_id: this.backendProv.institution,
                promo: data.promo,
                newusr: 'promo'
              });
              this.promoSend(promo);
            }
          }
        ]
      });
      prompt.present();
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Необходимо подтвердить номер телефона в личном кабинете',
        buttons: [
          {
            text: 'Закрыть'
          },
          {
            text: 'Принять',
            handler: data => {
              this.navCtrl.push(ProfiledetailsPage, {profile: this.profiles[0]});
            }
          }
        ]
      });
      alert.present();
    }
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  checkMenuePic(val) {
    if(val && val != '0') {
      return this.menuePicLink + '300/' + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  checkZero(val) {
    if(val) {
      if(val == '0') {
        return '';
      }
      else {
        return val;
      }
    }
    else {
      return '';
    }
  }

  openMenu() {
    this.menuCtrl.open();
  }
 
  closeMenu() {
    this.menuCtrl.close();
  }
 
  toggleMenu() {
    this.menuCtrl.toggle();
  }

  goProfileDetails(val) {
    this.navCtrl.push(ProfiledetailsPage, {profile: val});
  }

}
