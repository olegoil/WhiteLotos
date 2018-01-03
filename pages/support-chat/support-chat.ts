import { Component, ViewChild, Renderer } from '@angular/core';
import { Http } from  '@angular/http';
import { NavController, NavParams, Content, Platform, LoadingController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { BackendProvider } from '../../providers/backend/backend';

@Component({
  selector: 'page-support-chat',
  templateUrl: 'support-chat.html',
})
export class SupportChatPage {

  @ViewChild(Content) content: Content;

  messages: any = [];

  message: any = '';
  lineHeight: any = "22px";

  private inputElement;
  private millis = 200;
  private textareaHeight;
  private scrollContentElelment: any;
  private footerElement: any;
  private initialTextAreaHeight;
  private keyboardHideSub;
  private keybaordShowSub;

  profiles: any = [];
  piclink: any = 0;
  mypic: any = 'assets/img/logo.png';
  lastchat: any = 1;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private keyboard: Keyboard, public renderer: Renderer, public loadingCtrl: LoadingController, public backendProv: BackendProvider, public http: Http) {
    this.piclink = backendProv.piclink;
  }

  checkPic(val) {
    if(val && val != '0') {
      return this.piclink + val;
    }
    else {
      return 'assets/img/logo.png';
    }
  }

  ionViewDidEnter() {

    if (this.platform.is('ios')) {
      this.addKeyboardListeners()
    }

    this.scrollContentElelment = this.content.getScrollElement();

    this.footerElement = document.getElementsByTagName('page-support-chat')[0].getElementsByTagName('ion-footer')[0];
    this.inputElement = document.getElementsByTagName('page-support-chat')[0].getElementsByTagName('textarea')[0];

    this.footerElement.style.cssText = this.footerElement.style.cssText + "transition: all " + this.millis + "ms; -webkit-transition: all " +
      this.millis + "ms; -webkit-transition-timing-function: ease-out; transition-timing-function: ease-out;"

    this.scrollContentElelment.style.cssText = this.scrollContentElelment.style.cssText + "transition: all " + this.millis + "ms; -webkit-transition: all " +
      this.millis + "ms; -webkit-transition-timing-function: ease-out; transition-timing-function: ease-out;"

    this.textareaHeight = Number(this.inputElement.style.height.replace('px', ''));
    this.initialTextAreaHeight = this.textareaHeight;

    this.platform.ready().then(() => {
      this.keyboard.disableScroll(true);
    });

    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loader'
    });
    loading.present();

    this.backendProv.getProfile().then(res => {
      loading.dismiss();
      this.profiles = res;

      this.messages.push({
        img: 'assets/img/face.jpg',
        content :  'Здравствуйте! Чем Вам помочь?',
        position : 'left',
        time : new Date().toLocaleTimeString(),
        senderName : 'Поддержка'
      });
      this.getMessages();    
      this.mypic = this.checkPic(this.profiles[0].user_pic);

    }).catch(e => console.log(e));
    
  }

  ionViewWillLeave() {
    this.platform.ready().then(() => {
      this.keyboard.disableScroll(false);
      if (this.platform.is('ios')) {
        this.removeKeyboardListeners();
      }
    });
  }
  
  footerTouchStart(event) {
    //console.log('footerTouchStart: ', event.type, event.target.localName, '...')
    if (event.target.localName !== "textarea") {
      event.preventDefault();
      // console.log('preventing')
    }
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 500);
  }

  textAreaChange() {
    let newHeight = Number(this.inputElement.style.height.replace('px', ''));
    if (newHeight !== this.textareaHeight) {
      let diffHeight = newHeight - this.textareaHeight;
      this.textareaHeight = newHeight;
      let newNumber = Number(this.scrollContentElelment.style.marginBottom.replace('px', '')) + diffHeight;

      let marginBottom = newNumber + 'px';
      this.renderer.setElementStyle(this.scrollContentElelment, 'marginBottom', marginBottom);
    }
  }

  removeKeyboardListeners() {
    this.keyboardHideSub.unsubscribe();
    this.keybaordShowSub.unsubscribe();
  }

  addKeyboardListeners() {
    this.keyboardHideSub = this.keyboard.onKeyboardHide().subscribe(() => {
      let newHeight = this.textareaHeight - this.initialTextAreaHeight + 44;
      let marginBottom = newHeight + 'px';
      this.renderer.setElementStyle(this.scrollContentElelment, 'marginBottom', marginBottom);
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', '0px')
    });

    this.keybaordShowSub = this.keyboard.onKeyboardShow().subscribe((e) => {
      let newHeight = (e['keyboardHeight']) + this.textareaHeight - this.initialTextAreaHeight;
      let marginBottom = newHeight + 44 + 'px';
      this.renderer.setElementStyle(this.scrollContentElelment, 'marginBottom', marginBottom);
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', e['keyboardHeight'] + 'px');
    });
  }

  contentMouseDown(event) {
    //console.log('blurring input element :- > event type:', event.type);
    this.inputElement.blur();
  }

  touchSendButton(event: Event) {
    //console.log('touchSendButton, event type:', event.type);
    event.preventDefault();
    this.sendMessage();
  }

  sendMessage() {
    if(this.message != '') {

      let supportstr = JSON.stringify({
        device_id: this.backendProv.uuid,
        inst_id: this.backendProv.institution,
        getsend: 'send',
        name: 'support',
        txt: this.message,
        newusr: 'chat'
      });

      // console.log("SEND =========================> "+supportstr)

      this.writeMessages(supportstr);
      
    }
  }

  getMessages() {

    let getChat = "SELECT * FROM chat WHERE chat_name != ? AND chat_del='0' ORDER BY chat_id ASC";
    this.backendProv.database.executeSql(getChat, ['Запрос']).then(res => {
      
      if(res.rows.length > 0) {
        for (let i = 0;i < res.rows.length;i++) {
          if(res.rows.item(i).chat_message != 'Скидочная карта') {

            let mestime: any = this.backendProv.timezoneAdd(res.rows.item(i).chat_when);

            if(res.rows.item(i).chat_from == this.backendProv.myid) {
              this.messages.push({
                img: this.mypic,
                position: 'right',
                content: this.backendProv.decodeEntities(res.rows.item(i).chat_message),
                senderName: 'Я',
                time: new Date(mestime*1000).toLocaleTimeString()
              });
            }
            else if(res.rows.item(i).chat_from != this.backendProv.myid) {
              this.messages.push({
                img: 'assets/img/face.jpg',
                position: 'left',
                content: this.backendProv.decodeEntities(res.rows.item(i).chat_message),
                senderName: 'Поддержка',
                time: new Date(mestime*1000).toLocaleTimeString()
              });
            }

            if(res.rows.item(i).chat_when > this.lastchat) {
              this.lastchat = res.rows.item(i).chat_when;
            }

            if(i == res.rows.length - 1) {
              setTimeout(() => {
                this.content.scrollToBottom(300);
              }, 1000);
              this.checkMessages();
            }

          }
        }
      }
      else {
        this.checkMessages();
      }

    })
    .catch(e => {console.log(e)});

  }

  checkMessages() {

    let checkmesstr = JSON.stringify({
      device_id: this.backendProv.uuid,
      inst_id: this.backendProv.institution,
      getsend: 'get',
      lastchat: this.lastchat,
      newusr: 'chat'
    });

    this.writeMessages(checkmesstr);
      
  }

  writeMessages(messtr) {

    this.backendProv.httpRequest(messtr)
    .subscribe(res => {
      let data = res;
      
      // console.log("WRITE ====================================> "+JSON.stringify(data));

      if(data[0].chatOK == '1') {

        this.chatArrFunc(0, data[0].chatArr);

      }
      else if(data[0].chatOK > '1') {

        let chatIns = "INSERT INTO chat (chat_id, chat_from, chat_to, chat_name, chat_message, chat_read, chat_institution, chat_answered, chat_when, chat_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
        this.backendProv.database.executeSql(chatIns, [data[0].chatID, this.backendProv.myid, '1', 'support', this.message, '0', this.backendProv.institution, '0', data[0].chatOK, '0']).then(() => {

          let mestime: any = this.backendProv.timezoneAdd(data[0].chatOK);

          this.messages.push({
            img: this.mypic,
            position: 'right',
            content: this.message,
            senderName: 'Я',
            time: new Date(mestime*1000).toLocaleTimeString()
          });

          this.message = '';

          let currentHeight = this.scrollContentElelment.style.marginBottom.replace('px', '');
          let newHeight = currentHeight - this.textareaHeight + this.initialTextAreaHeight;
          let top = newHeight + 'px';
          this.renderer.setElementStyle(this.scrollContentElelment, 'marginBottom', top);
          this.textareaHeight = this.initialTextAreaHeight;
          
          setTimeout(() => {
            this.content.scrollToBottom(300);
          }, 100);

        })
        .catch(e => console.log(e));

      }

      setTimeout(() => {
        this.checkMessages();
      }, 3000);
    }, 
    e => {
      console.log(e);
      setTimeout(() => {
        this.checkMessages();
      }, 3000);
    });

  }

  chatArrFunc(id, chatArr) {
    
    let chat_id = chatArr[id]['chat_id'];
    let chat_from = chatArr[id]['chat_from'];
    let chat_to = chatArr[id]['chat_to'];
    let chat_name = chatArr[id]['chat_name'];
    let chat_message = chatArr[id]['chat_message'];
    let chat_read = chatArr[id]['chat_read'];
    let chat_institution = chatArr[id]['chat_institution'];
    let chat_answered = chatArr[id]['chat_answered'];
    let chat_when = chatArr[id]['chat_when'];
    let chat_del = chatArr[id]['chat_del'];

    this.lastchat = chat_when;

    let queryChat = "SELECT * FROM chat WHERE chat_id = ? AND chat_del='0'";
    this.backendProv.database.executeSql(queryChat, [chat_id]).then(suc => {

      if(suc.rows.length > 0) {
        let chatUpd = "UPDATE chat SET chat_read=?, chat_answered=?, chat_when=?, chat_del=? WHERE chat_id=?";
        this.backendProv.database.executeSql(chatUpd, [chat_read, chat_answered, chat_when, chat_del, chat_id])
        .then(() => {
          id++;
          if(id < chatArr.length) {
            this.chatArrFunc(id, chatArr);
          }
        })
        .catch(e => console.log(e));
      }
      else {
        let chatIns = "INSERT INTO chat (chat_id, chat_from, chat_to, chat_name, chat_message, chat_read, chat_institution, chat_answered, chat_when, chat_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
        this.backendProv.database.executeSql(chatIns, [chat_id, chat_from, chat_to, chat_name, chat_message, chat_read, chat_institution, chat_answered, chat_when, chat_del]).then(() => {

          let mestime: any = this.backendProv.timezoneAdd(chat_when);

          if(chat_from == this.backendProv.myid) {
            this.messages.push({
              img: this.mypic,
              position: 'right',
              content: this.backendProv.decodeEntities(chat_message),
              senderName: 'Я',
              time: new Date(mestime*1000).toLocaleTimeString()
            });
          }
          else if(chat_from != this.backendProv.myid) {
            this.messages.push({
              img: 'assets/img/face.jpg',
              position: 'left',
              content: this.backendProv.decodeEntities(chat_message),
              senderName: 'Поддержка',
              time: new Date(mestime*1000).toLocaleTimeString()
            });
          }

          setTimeout(() => {
            this.content.scrollToBottom(300);
          }, 100);

          id++;
          if(id < chatArr.length) {
            this.chatArrFunc(id, chatArr);
          }
        })
        .catch(e => console.log(e));
      }

    })
    .catch(e => console.log(e));

  }

}
