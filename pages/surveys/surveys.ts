import { Component } from '@angular/core';
import { App, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';

import { BackendProvider } from '../../providers/backend/backend';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-surveys',
  templateUrl: 'surveys.html',
})
export class SurveysPage {

  surveys: any = [];
  answers: any = {};
  nav: any;

  constructor(private app: App, public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public backendProv: BackendProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    

  }

  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    this.backendProv.getSurveys()
    .then(res => {
      this.surveys = res;
      loading.dismiss();
    })
    .catch(e => {});
  }

  goHome() {
    this.nav = this.app.getRootNavById('n4')
    this.nav.setRoot(HomePage);
  }

  decodeEntities(val) {
    return this.backendProv.decodeEntities(val);
  }

  sendAnswers() {
    
    if(this.answers) {
        
        if(Object.keys(this.answers).length > 0) {

          let m = 0;

          Object.keys(this.answers).forEach(item => {

            this.backendProv.httpRequest(JSON.stringify({
              device: this.backendProv.model,
              device_id: this.backendProv.uuid,
              device_version: this.backendProv.version,
              device_os: this.backendProv.platform,
              inst_id: this.backendProv.institution,
              newusr:'asks',
              asks_id: item,
              asks_answ: this.answers[item],
              asks_vers: 2
            }))
            .subscribe(res => {
              
              this.backendProv.saveRequestRes(res, item, this.answers[item]);
              
              if(m == Object.keys(this.answers).length-1) {
                this.surveys = [];
                setTimeout(() => {
                  this.goHome();
                  let alert = this.alertCtrl.create({
                    title: 'Благодарим',
                    subTitle: 'Спасибо за ответы!',
                    buttons: ['Закрыть']
                  });
                  alert.present();
                }, 1000);
              }
              m++;

            },
            e => {
              console.log(e);
            });
  
          });

        }

    }
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

}
