import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-profiledetails',
  templateUrl: 'profiledetails.html',
})
export class ProfiledetailsPage {

  profiles: any = [];
  piclink: any = 0;
  maxdate: any = new Date();
  masks: any;
  emailMask: any = emailMask;
  smsOrdered: any = 0;
  smsConfirmed: any = 0;
  confcode: any = '';
  notSaved: any = 0;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public backendProv: BackendProvider, private keyboard: Keyboard, private alertCtrl: AlertController, private camera: Camera, private file: File, private transfer: FileTransfer, public loadingCtrl: LoadingController, private imagePicker: ImagePicker, public actionSheetCtrl: ActionSheetController) {
    this.profiles.push(navParams.get('profile'));
    this.piclink = backendProv.piclink;
    this.maxdate = this.maxdate.getFullYear()-15 + '-' + this.maxdate.getMonth() + '-' + this.maxdate.getDate();
    this.masks = {
      phoneNumber: ['+', /[1-9]/, /\d/, /\d/, '(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
      phoneEmail: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cardNumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
      orderCode: [/[a-zA-z]/, ':', /\d/, /\d/, /\d/, /\d/]
    }
    this.smsOrdered = this.profiles[0].user_conf_req;
    this.smsConfirmed = this.profiles[0].user_mob_confirm;
  }

  onKeyBio(event: any) {
    this.profiles[0].user_info = event.target.value;
    this.notSaved = 0;
  }

  onKeyConf(event: any) {
    this.confcode = event.target.value;
    this.notSaved = 0;
  }

  onKeyCity(event: any) {
    this.profiles[0].user_city = event.target.value;
    this.notSaved = 0;
  }

  onKeyEmail(event: any) {
    this.profiles[0].user_email = event.target.value;
    this.notSaved = 0;
  }

  onKeyName(event: any) {
    this.profiles[0].user_name = event.target.value;
    this.notSaved = 0;
  }

  onKeyFam(event: any) {
    this.profiles[0].user_surname = event.target.value;
    this.notSaved = 0;
  }

  onKeyMob(event: any) {
    this.profiles[0].user_mob = event.target.value.replace(/\D+/g, '');
    this.notSaved = 0;
  }

  saveProfile() {

    for(let key in this.profiles[0]) {
      if(this.profiles[0].hasOwnProperty(key)) {
        if(this.profiles[0][key] == null || this.profiles[0][key] == '') {
          this.profiles[0][key] = 0;
        }
      }
    }

    let updstr = {
      device: this.backendProv.model,
      device_id: this.backendProv.uuid,
      device_version: this.backendProv.version,
      device_os: this.backendProv.platform,
      user_name: this.profiles[0].user_name,
      user_surname: this.profiles[0].user_surname,
      user_middlename: this.profiles[0].user_middlename,
      user_email: this.profiles[0].user_email,
      user_tel: this.profiles[0].user_tel,
      user_mob: this.profiles[0].user_mob,
      user_info: this.profiles[0].user_info,
      user_pic: this.profiles[0].user_pic,
      user_gender: this.profiles[0].user_gender,
      user_birthday: this.profiles[0].user_birthday,
      user_country: 0,
      user_region: 0,
      user_city: this.profiles[0].user_city,
      user_adress: 0,
      user_install_where: this.profiles[0].user_install_where,
      inst_id: this.backendProv.institution,
      newusr: 'upd'
    }

    this.backendProv.httpRequest(JSON.stringify(updstr))
    .subscribe((updsuc) => {
      this.backendProv.updateProfile(this.profiles[0]);
      let alert = this.alertCtrl.create({
        title: 'Внимание',
        subTitle: 'Данные сохраннены!',
        buttons: ['Закрыть']
      });
      alert.present();
      this.notSaved = 0;
    }, (error) => {
      console.log(JSON.stringify(error));
    });
  
  }

  confirmSms() {

    let smsstr = {
      device_id: this.backendProv.uuid,
      inst_id: this.backendProv.institution,
      sms: this.confcode,
      newusr: 'sms'
    }

    this.backendProv.httpRequest(JSON.stringify(smsstr))
    .subscribe((smssuc) => {

      let data = smssuc;

      if(data[0].smsOK == '5') {
        
        this.smsConfirmed = 1;

        this.backendProv.smsConfirmOk(data);

        let alert = this.alertCtrl.create({
          title: 'Спасибо',
          subTitle: 'Номер подтвержден!',
          buttons: ['Закрыть']
        });
        alert.present();

      }
      else if(data[0].smsOK == '6') {

        let alert = this.alertCtrl.create({
          title: 'Внимание',
          subTitle: 'Неверно заданный код!',
          buttons: ['Закрыть']
        });
        alert.present();

      }

    }, (error) => {
      console.log(JSON.stringify(error));
    });

  }

  requestSms(val) {

    this.backendProv.updateProfile(val);

    for(let key in this.profiles[0]) {
      if(this.profiles[0].hasOwnProperty(key)) {
        if(this.profiles[0][key] == null || this.profiles[0][key] == '') {
          this.profiles[0][key] = 0;
        }
      }
    }

    let updstr = {
      device: this.backendProv.model,
      device_id: this.backendProv.uuid,
      device_version: this.backendProv.version,
      device_os: this.backendProv.platform,
      user_name: this.profiles[0].user_name,
      user_surname: this.profiles[0].user_surname,
      user_middlename: this.profiles[0].user_middlename,
      user_email: this.profiles[0].user_email,
      user_tel: this.profiles[0].user_tel,
      user_mob: this.profiles[0].user_mob,
      user_gender: this.profiles[0].user_gender,
      user_birthday: this.profiles[0].user_birthday,
      user_country: 0,
      user_region: 0,
      user_city: 0,
      user_adress: 0,
      user_install_where: this.profiles[0].user_install_where,
      inst_id: this.backendProv.institution,
      newusr: 'upd'
    }

    this.backendProv.httpRequest(JSON.stringify(updstr))
    .subscribe(updsuc => {

      // let unmaskedData = {
      //     phoneNumber: this.phoneNumber.replace(/\D+/g, ''),
      //     cardNumber: this.cardNumber.replace(/\D+/g, ''),
      //     cardExpiry: this.cardExpiry.replace(/\D+/g, ''),
      //     orderCode: this.orderCode.replace(/[^a-zA-Z0-9 -]/g, '')
      // };

      // console.log(unmaskedData);
      
      let smsstr = {
        device_id: this.backendProv.uuid,
        inst_id: this.backendProv.institution,
        sms: '0',
        newusr: 'sms'
      }

      this.backendProv.httpRequest(JSON.stringify(smsstr))
      .subscribe(ressms => {
        
        let data = ressms;

        if(data[0].smsOK == '2') {
        
          let alert = this.alertCtrl.create({
            title: 'Внимание',
            subTitle: 'Повторный запрос только через 5 минут!',
            buttons: ['Закрыть']
          });
          alert.present();

        }
        else if(data[0].smsOK == '3') {

          this.smsOrdered = 1;

          this.backendProv.smsRequestOk(data[0].when);

        }
        else if(data[0].smsOK == '4') {

          let alert = this.alertCtrl.create({
            title: 'Внимание',
            subTitle: 'Укажите Ваш номер телефона!',
            buttons: ['Закрыть']
          });
          alert.present();
        
        }

      }, (error) => {console.log(error)});

    }, (error) => {console.log(error)});

  }

  checkPic(val) {
    if(val && val != '0') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  checkZero(val) {
    if(val) {
      if(val == '0') {
        return '';
      }
      else {
        return val;
      }
    }
    else {
      return '';
    }
  }

  checkLegth(val) {
    return val.length;
  }

  makePic() {

    let optionsselfie: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 700,
      targetHeight: 700,
      correctOrientation: true
    }
    
    this.camera.getPicture(optionsselfie).then((imageURI) => {

      let when = Math.floor(new Date().getTime() / 1000);
      let randpicname = this.backendProv.myid + '_' + when;
      let namefilesplit = imageURI.split('/');
      let namefile = namefilesplit[namefilesplit.length-1];
      let oldurlsplit = imageURI.split(namefile);
      let oldurl = oldurlsplit[0];
      let topath = this.file.dataDirectory + this.backendProv.instdir + '/' + randpicname + '.jpg';
      let tourl = this.file.dataDirectory + this.backendProv.instdir + '/';

      this.file.moveFile(oldurl, namefile, tourl, randpicname + '.jpg')
      .then(res => {
        this.savePic(topath, randpicname);
      })
      .catch(e => console.log(e));

    }, (err) => {
    // Handle error
    });

  }

  selPic() {

    let optionsImg = {
      maximumImagesCount: 1,
      width: 700,
      height: 700,
      quality: 100
    }

    this.imagePicker.getPictures(optionsImg)
    .then((results) => {

      if(results.length > 0) {

        for (let i = 0; i < results.length; i++) {

          // DATE - TIME IN SECONDS
          let when = Math.floor(new Date().getTime() / 1000);
          let randpicname = this.backendProv.myid + '_' + when;
          let namefilesplit = results[i].split('/');
          let namefile = namefilesplit[namefilesplit.length-1];
          let oldurlsplit = results[i].split(namefile);
          let oldurl = oldurlsplit[0];
          let topath = this.file.dataDirectory + this.backendProv.instdir + '/' + randpicname + '.jpg';
          let tourl = this.file.dataDirectory + this.backendProv.instdir + '/';

          this.file.copyFile(oldurl, namefile, tourl, randpicname + '.jpg').then((success) => {

            this.savePic(topath, randpicname);

          }, (er) => {});
        
        }

      }

    }, 
    (error) => {
      
    });

  }

  savePic(imgpath, randpicname) {
    
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    // UPLOADING SOUND
    let options = {
      fileKey: "file",
      fileName: randpicname + '.jpg',
      chunkedMode: false,
      mimeType: 'image/jpeg'
    }

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(imgpath, "http://www.olegtronics.com/admin/coms/upload.php?usrupl=1&preview=1&user_id=" + this.backendProv.myid, options)
    .then((result) => {
        
      let srtringify = JSON.stringify(result.response);
      let parsingres = JSON.parse(JSON.parse(srtringify));
      let messent = parsingres.user_upd;

      if(messent > 0) {

        this.profiles[0].user_pic = randpicname + '.jpg';
        
        this.file.removeFile(this.file.dataDirectory + this.backendProv.instdir + '/', randpicname + '.jpg');

      }

      loading.dismiss();

    }, 
    (err) => {
      loading.dismiss();
    });

  }
  
  // document.getElementById('loadprog').innerHTML = Math.round((progress.loaded / progress.total) * 100) + ' %';

  chImg() {
    let entryRequestAS = this.actionSheetCtrl.create({
      title: 'Изменить Аватар',
      subTitle: 'Выбрать из галереи или снять новую фотографию?',
      buttons: [
        {
          text: 'Выбрать из галереи',
          handler: () => {
            this.selPic();
          }
        },
        {
          text: 'Снять новое фото',
          handler: () => {
            this.makePic();
          }
        },
        {
          text: 'Отменить',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    entryRequestAS.present();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.keyboard.disableScroll(true);
    });
  }

}
