import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {

  places: any = [];
  profiles: any = [];
  selectOptions: any = {};
  piclink: any = 0;
  review: any = {
    device_id: 0,
    inst_id: 0,
    location: 'В общем',
    rating: 5,
    pic: 0,
    ratingtxt: '',
    newusr: 'rate'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public backendProv: BackendProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private imagePicker: ImagePicker, public actionSheetCtrl: ActionSheetController, private camera: Camera, private file: File, private transfer: FileTransfer) {

    this.piclink = backendProv.piclink;

    this.backendProv.getOffices()
    .then(res => {
      this.places = res;
    })
    .catch(e => console.log(e));

    this.selectOptions = {
      title: 'Выбор отдела',
      subTitle: 'г. Минск'
    };

    this.review.device_id = this.backendProv.uuid;
    this.review.inst_id = this.backendProv.institution;

  }

  chImg() {
    let entryRequestAS = this.actionSheetCtrl.create({
      title: 'Добавить фотографию',
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

        this.review.pic = randpicname + '.jpg';
        
        this.file.removeFile(this.file.dataDirectory + this.backendProv.instdir + '/', randpicname + '.jpg');

      }

      loading.dismiss();

    }, 
    (err) => {
      loading.dismiss();
    });

  }

  checkPic(val) {
    if(val && val != '0') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/face.jpg';
    }
  }

  sendReview() {
    let alert = this.alertCtrl.create({
      title: 'Отправить',
      message: 'Отправить отзыв?',
      buttons: [
        {
          text: 'Нет',
          role: 'cancel',
          handler: () => {
            // this.navCtrl.popToRoot();
            let data = { 'goroot': '1' };
            this.viewCtrl.dismiss(data);
          }
        },
        {
          text: 'Да',
          handler: () => {
            this.review.ratingtxt += ' - ' + this.review.location;
            this.backendProv.httpRequest(JSON.stringify(this.review))
            .subscribe(res => {

              if(res[0].reviewOK == '0') {
                
              }
              else if(res[0].reviewOK == '1') {

                let alertThx = this.alertCtrl.create({
                  title: 'Спасибо',
                  subTitle: 'Отзыв отправлен!',
                  buttons: ['Закрыть']
                });
                alertThx.present();
                // this.navCtrl.popToRoot();
                let data = { 'goroot': '1' };
                this.viewCtrl.dismiss(data);

              }
              else if(res[0].reviewOK == '2') {
                let alertThx = this.alertCtrl.create({
                  title: 'Внимание',
                  subTitle: 'Один отзыв только каждые 12 часов!',
                  buttons: ['Закрыть']
                });
                alertThx.present();
              }
              
            }, e => console.log(e));
          }
        }
      ]
    });
    alert.present();
  }

  close() {
    // this.navCtrl.popToRoot();
    let data = { 'goroot': '1' };
    this.viewCtrl.dismiss(data);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ReviewPage');
  }

}
