import { Component, ViewChild, NgZone } from '@angular/core';
import { App, NavController, MenuController, NavParams, Content, AlertController, LoadingController, Platform } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { QrsummPage } from '../qrsumm/qrsumm';
import { TabsPage } from '../tabs/tabs';
import { NewsPage } from '../news/news';
import { TermsPage } from '../terms/terms';
import { SharePage } from '../share/share';
import { ReviewPage } from '../review/review';
import { GiftsPage } from '../gifts/gifts';
import { SocialPage } from '../social/social';
import { GiftsdetailPage } from '../giftsdetail/giftsdetail';
import { ContactPage } from '../contact/contact';
import { ServiceRitualsPage } from '../service-rituals/service-rituals';
import { ServiceProgrammsPage } from '../service-programms/service-programms';
import { ServiceGiftcardsPage } from '../service-giftcards/service-giftcards';
import { QrcodePage } from '../qrcode/qrcode';
import { ProfiledetailsPage } from '../profiledetails/profiledetails';
import { IntroPage } from '../intro/intro';
import { SurveysPage } from '../surveys/surveys';

import { RitualchoicePage } from '../ritualchoice/ritualchoice';
import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('logoSliding', [
      state('notSlided', style({
        opacity: 1,
        transform: 'scale(1) translateY(0px)'
      })),
      state('slided', style({
        opacity: 0,
        transform: 'scale(0) translateY(7px)'
      })),
      transition('* => slided', animate('200ms linear')),
      transition('* => notSlided', animate('200ms linear'))
    ])
  ]
})
export class HomePage {

  @ViewChild(Content) content: Content;

  gifts: any = [];
  realexpression: any = 0;
  uuid: any = 1234567890;
  points: any = '';
  profiles: any = [];

  logoState: any;
  giftsPicLink: any;
  stateChng: any = 0;
  firstGift: any = [];
  public scrollAmount = 0;

  nav: any;

  constructor(private app: App, private platform: Platform, public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public backendProv: BackendProvider, public zone: NgZone, public alertCtrl: AlertController, private iab: InAppBrowser, public loadingCtrl: LoadingController) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        if(this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        }
        else {
          this.nav = this.app.getRootNavById('n4')
          this.nav.setRoot(IntroPage);
        }
      });
    });
    
    this.logoState = 'notSlided';

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    backendProv.getLastGifts()
    .then(res => {
      loading.dismiss();
      this.gifts = res;
    })
    .catch(e => console.log(e));

    this.backendProv.getProfile()
    .then(res => {
      this.profiles = res;

      this.backendProv.getWallet()
      .then(res => {
        if(res) {
          this.points = res[0].wallet_total;
        }
      })
      .catch(e => console.log(e));
      
    })
    .catch(e => console.log(e));

    this.backendProv.getFirstGifts()
    .then(res => {
      this.firstGift = res;
    })
    .catch(e => console.log(e));

    this.uuid = backendProv.uuid;
    this.giftsPicLink = backendProv.giftsPicLink;
  }

  ionViewOnEnter() {
    
  }

  goSurveys() {
    this.navCtrl.push(SurveysPage);
  }

  checkPoints() {
    
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

  checkPic(val) {
    if(val && val != '0') {
      return this.giftsPicLink + 'pic/' + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  goQRCode() {
    if(this.profiles.length > 0) {
      if(this.profiles[0].user_work_pos > '1') {
        this.navCtrl.push(QrcodePage, {
          type: 'points',
          realexpression: this.realexpression,
          uuid: this.uuid,
        });
      }
      else if(this.profiles[0].user_mob_confirm == '1') {
        this.navCtrl.push(QrcodePage, {
          type: 'points',
          realexpression: this.realexpression,
          uuid: this.uuid,
        });
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
              text: 'Подтвердить',
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

  toggleLogo() {
    this.logoState = (this.logoState == 'notSlided') ? 'slided' : 'notSlided';
  }

  scrollHandler(event) {
    this.zone.run(()=>{
      if(event.scrollTop <= 10 && this.logoState == 'slided') {
        this.logoState = 'notSlided';
      }
      else if(event.scrollTop > 10 && this.logoState == 'notSlided') {
        this.logoState = 'slided';
      }
    })
  }

  call() {
    this.iab.create('tel:7579', '_system', {location:'yes'});
  }

  goContact() {
    this.navCtrl.push(ContactPage);
  }

  goGiftsDetail(val) {
    this.navCtrl.push(GiftsdetailPage, {gift: val});
  }

  goSocial() {
    this.navCtrl.push(SocialPage);
  }

  goGifts() {
    this.navCtrl.push(GiftsPage);
  }

  goReview() {
    this.navCtrl.push(ReviewPage);
  }

  goShare() {
    this.navCtrl.push(SharePage);
  }

  goTerms() {
    this.navCtrl.push(TermsPage);
  }

  goNews() {
    this.navCtrl.push(NewsPage);
  }

  goQRSumm() {
    this.navCtrl.push(QrsummPage);
  }

  goTabs() {
    this.navCtrl.push(TabsPage);
  }

  goRituals() {
    this.navCtrl.push(RitualchoicePage);
  }

  goGiftCards() {
    this.navCtrl.push(ServiceGiftcardsPage);
  }

  goSpaRitual() {
    this.navCtrl.push(ServiceRitualsPage);
  }

  goSpaProgramm() {
    this.navCtrl.push(ServiceProgrammsPage);
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

}
