import { Component } from '@angular/core';
import { MenuController, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { RitualchoicePage } from '../ritualchoice/ritualchoice';
import { ProfiledetailsPage } from '../profiledetails/profiledetails';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  points: any = '';
  profiles: any = [];
  nav: any;

  constructor(private platf: Platform, public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public backendProv: BackendProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    this.platf.ready().then(() => {

      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: 'loader'
      });
      loading.present();

      this.platf.registerBackButtonAction(() => {
        if(this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        }
      });

      this.backendProv.startCheck()
      .then(res1 => {

        this.backendProv.getProfile()
        .then(res2 => {
          this.profiles = res2;
  
          this.backendProv.getWallet()
          .then(res3 => {
            if(res3) {
              loading.dismiss();
              this.points = res3[0].wallet_total;
            }
          })
          .catch(e => {
            loading.dismiss();
            console.log(e);
          });
          
        })
        .catch(e => {
          loading.dismiss();
          console.log(e);
        });

      })
      .catch(e => {
        loading.dismiss();
        console.log(e);
      });
      
    })
  }

  checkPoints() {
    if(this.profiles.length > 0) {
      this.backendProv.getWallet()
      .then(res => {

        let alert = this.alertCtrl.create({
          title: 'Баланс',
          message: 'На Вашем счете '+res[0].wallet_total+' баллов',
          buttons: [
            {
              text: 'Ок',
              role: 'cancel',
              handler: () => {
                
              }
            }
          ]
        });
        alert.present();

      })
      .catch(e => console.log(e));
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Необходима перезагрузка приложения с подключенным интернетом!',
        buttons: ['Закрыть']
      });
      alert.present();
    }
  }

  goRituals() {
    if(this.profiles.length > 0) {
      if(this.profiles[0].user_work_pos > '1') {
        let alert = this.alertCtrl.create({
          title: 'Внимание',
          subTitle: 'Доступ к данной услуге был закрыт.',
          buttons: ['Закрыть']
        });
        alert.present();
      }
      else if(this.profiles[0].user_mob_confirm == '1') {
        this.navCtrl.push(RitualchoicePage);
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
    else {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Необходима перезагрузка приложения с подключенным интернетом!',
        buttons: ['Закрыть']
      });
      alert.present();
    }
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  goHome() {
    if(this.profiles.length > 0) {
      this.navCtrl.setRoot(HomePage)
      .then(() => {
        this.navCtrl.popToRoot();
      });
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Необходима перезагрузка приложения с подключенным интернетом!',
        buttons: ['Закрыть']
      });
      alert.present();
    }
  }

}
