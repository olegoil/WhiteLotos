import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  terms: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider) {
    this.terms = backendProv.getTerms();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TermsPage');
  }

}
