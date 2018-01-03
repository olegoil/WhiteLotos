import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  abouts: any = [];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public navParams: NavParams, public backendProv: BackendProvider) {
    this.abouts = backendProv.getAbout();
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
