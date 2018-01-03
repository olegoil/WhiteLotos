import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

import { SupportChatPage } from '../support-chat/support-chat';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-support-faq',
  templateUrl: 'support-faq.html',
})
export class SupportFaqPage {

  getfaq: any = [];
  shownGroup: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public backendProv: BackendProvider) {
    this.getfaq = backendProv.getFAQ();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SupportFaqPage');
  }

  goChat() {
    this.navCtrl.push(SupportChatPage);
  }

  toggleGroup = function(faq) {
    if (this.isGroupShown(faq)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = faq;
    }
  }

  isGroupShown = function(faq) {
    return this.shownGroup === faq;
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
