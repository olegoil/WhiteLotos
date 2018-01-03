import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TimepointsPipe } from '../../pipes/timepoints/timepoints';

import { IntroPage } from '../intro/intro';

@Component({
  selector: 'page-ordered',
  templateUrl: 'ordered.html',
})
export class OrderedPage {

  dateday: any;
  datemonth: any;
  datetime: any;
  dateplace: any = [];
  unixtime: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public tpp: TimepointsPipe) {
    this.dateday = this.navParams.get('dateday');
    this.datemonth = this.navParams.get('datemonth');
    this.unixtime = this.navParams.get('unixtime');
    this.datetime = this.tpp.transform(this.navParams.get('datetime'));
    this.dateplace = [this.navParams.get('dateplace')];

    // console.log(this.dateday+' | '+this.datemonth+' | '+this.unixtime+' | '+this.datetime+' | '+JSON.stringify(this.dateplace))
  }

  ionViewDidLoad() {
    
  }

  goToRoots() {
    this.navCtrl.setRoot(IntroPage);
    this.navCtrl.popToRoot();
  }

  formatBusHours(val) {
    return val.slice(0,2) + ':' + val.slice(2,4) + '-' + val.slice(4,6) + ':' + val.slice(6,8);
  }

  recalcBusHours(val) {
    let valold = '';
    let startday = '';
    let endday = '';
    let valfinal = [];
    let days= ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    for(let i=0;i<val.length;i++) {
      if(valold == val[i]) {
        endday = ' - '+days[i];
        if(i==val.length-1) {
          valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
        }
      }
      else {
        if(startday != '') {
          valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
          startday = days[i];
          endday = '';
          valold = val[i];
          if(i==val.length-1) {
            valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
          }
        }
        else {
          startday = days[i];
          valold = val[i];
          if(i==val.length-1) {
            valfinal.push({day: startday+endday, times: this.formatBusHours(valold)});
          }
        }
      }
    }
    return valfinal;
  }

  recalcPhone(tel) {
    if (!tel) { return ''; }
    var value = tel.toString().trim().replace(/^\+/, '');
    if (value.match(/[^0-9]/)) {
        return tel;
    }
    var country, city, number;
    switch (value.length) {
        case 10: // +1PPP####### -> C (PPP) ###-####
            country = 1;
            city = value.slice(0, 3);
            number = value.slice(3);
            break;

        case 11: // +CPPP####### -> CCC (PP) ###-####
            country = value[0];
            city = value.slice(1, 4);
            number = value.slice(4);
            break;

        case 12: // +CCCPP####### -> CCC (PP) ###-####
            country = value.slice(0, 3);
            city = value.slice(3, 5);
            number = value.slice(5);
            break;

        case 13: // +CCCPP####### -> CC (PPP) ###-####
            country = value.slice(0, 2);
            city = value.slice(2, 5);
            number = value.slice(5);
            break;

        default:
            return tel;
    }
    if (country == 1) {
        country = "";
    }
    number = number.slice(0, 3) + '-' + number.slice(3);
    return (country + " (" + city + ") " + number).trim();
  }

}
