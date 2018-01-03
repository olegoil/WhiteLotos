import { Component } from '@angular/core';
import { App, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { NewsPage } from '../pages/news/news';
import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { SupportFaqPage } from '../pages/support-faq/support-faq';
import { IntroPage } from '../pages/intro/intro';
import { SurveysPage } from '../pages/surveys/surveys';

import { BackendProvider } from '../providers/backend/backend';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = IntroPage;
  nav: any;

  constructor(private app: App, platform: Platform, statusBar: StatusBar, public menuCtrl: MenuController, splashScreen: SplashScreen, public backendProv: BackendProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goIndex() {
    this.nav = this.app.getRootNavById('n4')
    this.nav.setRoot(IntroPage);
  }

  goSurveys() {
    this.rootPage = SurveysPage;
  }

  goSupport() {
    this.rootPage = SupportFaqPage;
  }

  goProfile() {
    this.rootPage = ProfilePage;
  }

  goAbout() {
    this.rootPage = AboutPage;
  }

  goHome() {
    this.rootPage = HomePage;
  }

  goNews() {
    this.rootPage = NewsPage;
  }

}
