import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';

import { ExpresschoicePage } from '../expresschoice/expresschoice';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ExpresschoicePage;
  
  currentTab: any = 0;
  selexpress: any = [];
  offices: any = [];
  takedate: any = new Date();
  masters: any = [];
  ritualdate: any;
  professions: any = [];
  menuecat: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private superTabsCtrl: SuperTabsController, public backendProv: BackendProvider, public loadingCtrl: LoadingController) {

    this.selexpress = this.navParams.get('selexp');
    this.offices = this.navParams.get('offices');
    this.menuecat = this.navParams.get('menuecat');
    
    // this.takedate.setHours(0,0,0,0);
    // this.ritualdate = backendProv.timezoneAdd((this.takedate.getTime()/1000).toFixed(0));
    // console.log('DaAAAAATE1 =========> '+new Date(this.ritualdate*1000));
    this.ritualdate = backendProv.timezoneAdd((this.takedate.getTime()/1000).toFixed(0));
    // console.log('DaAAAAATE2 =========> '+new Date(testdate*1000));
    // console.log('DaAAAAATE3 =========> '+new Date());
    // console.log(JSON.stringify(this.selexpress));

    // PRELOAD DATA
    backendProv.loadSchedule();
    backendProv.loadRoom();
    backendProv.loadOrdering();

    backendProv.getProfessions().then(res => {
      this.professions = res;
      this.loadMasters();
    }).catch(e => {});

  }

  selEarliest(val) {
    let selearliest = [];
    for(let i=0;i<this.masters.length;i++) {
      if(val == this.masters[i].user_office) {
        selearliest.push(this.masters[i]);
      }
    }
    return selearliest;
  }

  loadMasters() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    this.backendProv.getMastersEarl(this.selexpress.menue_id, this.selexpress.menue_interval*60, this.offices)
    .then(res => {
      this.masters = res;
      for(let v=0;v<this.masters.length;v++) {
        for(let p=0;p<this.professions.length;p++) {
          if(this.masters[v].user_work_pos == this.professions[p].prof_id) {
            this.masters[v].user_prof = this.professions[p].prof_name;
          }
        }
      }
      loading.dismiss();
    })
    .catch(e => {
      console.log('ERRRROR '+JSON.stringify(e));
    });
  }

  onSwipe(e) {
    if(e.offsetDirection == '2' && this.currentTab < this.offices.length-1) {
      let newtab = parseInt(this.currentTab)+1;
      this.superTabsCtrl.slideTo(newtab);
    }
    else if(e.offsetDirection == '4' && this.currentTab > 0) {
      let newtab = parseInt(this.currentTab)-1;
      this.superTabsCtrl.slideTo(newtab);
    }
  }

  onTabSelect(ev: any) {
    this.currentTab = ev.in_id;
    // console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
  }

  ionViewDidEnter() {
    
  }

}
