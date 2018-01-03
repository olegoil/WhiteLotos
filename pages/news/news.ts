import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { NewsdetailPage } from '../newsdetail/newsdetail';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  news: any = [];
  newsPicLink: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public navParams: NavParams, public backendProv: BackendProvider, public loadingCtrl: LoadingController) {

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    backendProv.getNews().then(res => {
      loading.dismiss();
      this.news = res;
    }).catch(e => console.log(e));
    this.newsPicLink = backendProv.newsPicLink;
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.newsPicLink + 'pic/' + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  goNewsDetail(val) {
    this.navCtrl.push(NewsdetailPage, {news: val});
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

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewsPage');
  }

}
