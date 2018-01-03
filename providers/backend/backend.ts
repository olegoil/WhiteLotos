import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from  '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/timeout';
import { Device } from '@ionic-native/device';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Injectable()
export class BackendProvider {

  database: SQLiteObject;

  // COMPANY DEPENDENT DATA
  uuid: any;
  model: any;
  platform: any;
  version: any;
  serial: any;
  institution: any;
  db: any;
  appname: any;
  instdir: any;
  gcm_android: any;
  generalscript: any;
  pushgotlink: any;
  piclink: any;
  iosLink: any;
  androidLink: any;
  companyIcon: any;
  officePicLink: any;
  menuePicLink: any;
  giftsPicLink: any;
  newsPicLink: any;
  sharelink: any;
  groupFB: any;
  groupIG: any;

  myid: any = 0;

  // APP NEEDED DATA
  masters: any = [];
  mastersearl: any = [];
  master: any = [];
  sliders: any = [];
  dates: any = [];
  history: any = [];
  services: any = [];
  ritual: any = [];
  news: any = [];
  terms: any = [];
  sharedetails: any = [];
  about: any = [];
  institutions: any = [];
  faq: any = [];
  datetoday: any = new Date();
  serverdate: any = 0;
  serverdateraw: any = 0;
  quests: any = [];

  // FOR MASTER SCHEDULE
  checkedmasters1: any = 0;
  checkedmasters2: any = 0;
  checkinterval: any;
  checkintervalearl: any;
  schedules: any = [];
  orderings: any = [];
  rooms: any = [];

  // FOR UPDATE
  lastpoints: any = 0;
  lastwallet: any = 0;
  lastgoods: any = 0;
  lastcat: any = 0;
  lastmenue: any = 0;
  lastingrs: any = 0;
  lastnews: any = 0;
  lastrevs: any = 0;
  lastasks: any = 0;
  lastgifts: any = 0;
  lastchat: any = 1;
  lastorder: any = 0;
  lastroom: any = 0;
  lastfifthgift: any = 0;
  lastreservs: any = 0;
  lastorganization: any = 0;

  constructor(private platf: Platform, public http: Http, private sqlite: SQLite, private device: Device, private file: File, private push: Push) {

    // COMPANY DEPENDENT DATA
    this.institution = 28;
    this.instdir = 'whitelotos';
    this.gcm_android = '597748602860';
    this.generalscript = 'http://www.olegtronics.com/appscripts/getappdata.php';
    this.pushgotlink = 'http://www.olegtronics.com/admin/coms/pushgot.php';
    this.piclink = 'http://www.olegtronics.com/admin/img/user/'+this.institution+'/pic/';
    this.officePicLink = 'http://www.olegtronics.com/admin/img/icons/';
    this.menuePicLink = 'http://www.olegtronics.com/admin/img/menu/'+this.institution+'/';
    this.giftsPicLink = 'http://www.olegtronics.com/admin/img/gifts/'+this.institution+'/';
    this.newsPicLink = 'http://www.olegtronics.com/admin/img/news/'+this.institution+'/';
    this.iosLink = 'https://itunes.apple.com/us/app/whitelotos';
    this.androidLink = 'https://play.google.com/store/apps/details?id=by.olegtronics.whitelotos';
    this.groupFB = 'https://www.facebook.com/spa.whitelotus.minsk/';
    this.groupIG = 'https://www.instagram.com/thai_spa_whitelotus_minsk/';
    this.platf.ready().then(() => {
      this.uuid = this.device.uuid;
      this.model = this.device.model;
      this.platform = this.device.platform;
      this.version = this.device.version;
      this.serial = this.device.serial;
      if(this.platform == 'iOS') {
        this.sharelink = this.iosLink;
      }
      else {
        this.sharelink = this.iosLink;
      }
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;

        // this.db.close();
        
        // this.startCheck()
        // .then(res => {
        //   if(res == '1') {
        //     this.getInstitutions(this.institution).then(res => {this.companyIcon = this.officePicLink+res[0].org_logo;}).catch(e => console.log(e));
        //   }
        // })
        // .catch(e => console.log(e));

      })
      .catch(e => console.log(e));

    });
    
    this.sliders = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];
    
    this.datetoday.setHours(0,0,0,0);

    this.history = [{place: '1', service: '1', master: '2', date: this.datetoday}];

    this.terms = [{id: 1, img: 'logo.png', title: 'Бонусная система', text: 'Уважаемые клиенты (посетители) и пользователи мобильного приложения «Белый Лотос»!'},{id: 2, img: 'logo.png', title: 'Бонусная система', text: 'В мобильном приложении «Белый Лотос» есть Ваша персональная карта любимого клиента (бонусная программа лояльности).'},{id: 3, img: 'logo.png', title: 'Бонусная система', text: 'Предъявляйте ее мастеру каждый раз, когда заходите к нам.'},{id: 4, img: 'logo.png', title: 'Бонусная система', text: 'Карта любимого клиента позволяет Вам накапливать баллы и обменивать их на подарки из списка подарков в мобильном приложение.'},{id: 5, img: 'logo.png', title: 'Бонусная система', text: 'Баллы начисляются в эквиваленте 5% от суммы Вашего чека.'},{id: 6, img: 'logo.png', title: 'Бонусная система', text: 'Получить подарки за баллы можно только в «Белый Лотос».'},{id: 7, img: 'logo.png', title: 'Бонусная система', text: 'В случае, если Вы не воспользуетесь картой постоянного клиента для начисления баллов или получения подарков в течении 6 месяцев неиспользованные баллы будут аннулированы.'},{id: 8, img: 'logo.png', title: 'Бонусная система', text: 'Одновременное использование дисконтной программы лояльности и бонусной программы лояльности (в мобильном приложении) запрещено.'},{id: 9, img: 'logo.png', title: 'Бонусная система', text: 'Администрация оставляет за собой право изменять условия бонусной программы лояльности в одностороннем порядке.'},{id: 10, img: 'logo.png', title: 'Бонусная система', text: 'Начисление баллов не распространяется на специальные и акционные предложения!'}];

    this.sharedetails = [{id: 1, title: 'Поделитесь своим промокодом с друзьями', sharetext: 'Установи приложение «Белый Лотос» и получи бонусы.', promotext: 'Промокод:'}];

    this.about = [{id: 1, type: 0, img: 'logo.png', title: 'Бонусная система', text: 'Первый салон «Белый Лотос» открыл двери гостям в 2014 году, и на сегодняшний день сеть предлагает самый большой выбор в Минске тайских SPA-ритуалов и программ от профессиональных мастеров из Таиланда.'},{id: 2, type: 0, img: 'logo.png', title: 'Бонусная система', text: 'CПА-комплекс «Белого Лотоса» основан на классических техниках тайской системы исцеления и включает 10 ритуалов и 8 СПА-программ. Каждая из процедур имеет свои особенности и эффекты, благодаря чему клиенты могут выбрать ритуал на любой вкус и потребность, от снятия усталости и расслабления, до растяжки и коррекции фигуры.'},{id: 3, type: 0, img: 'logo.png', title: 'Бонусная система', text: 'Миссия «Белого Лотоса» - помочь каждому гостю переключиться с ежедневных забот, а также восстановить физическое и душевное равновесие с помощью тайских методик глубокой релаксации.'}];

    this.faq = [{id: 1, question: 'Я оплатил свой заказ, официант считал мою карту, но я не вижу зачисленных баллов в приложении. Что делать?', answer: 'Для того чтобы увидеть зачисленные баллы в этом случае, закройте приложение и запустите его заново. Если после этого Вы все еще не видите зачисленные баллы, проверьте подключение к Интернету. Наличие Интернета в Вашем смартфоне является необходимым условием для того, чтобы вы могли видеть Ваш актуальный баланс.'}, {id: 2, question: 'За что я получаю бонусные баллы?', answer: 'Бонусные баллы вы можете получить в нескольких случаях: <ul><li>Сделать заказ, оплатить его и предъявить официанту свою карту постоянного гостя на смартфоне.</li><li>Поделиться в социальных сетях приложением.</li><li>Поделиться со своим другом промо-кодом на установку приложения.</li></ul>'}, {id: 3, question: 'Я поделился новостью в социальной сети, однако бонусные баллы не были начислены.', answer: 'Для того чтобы увидеть зачисленные баллы в этом случае, закройте приложение и запустите его заново. Если после этого Вы все еще не видите зачисленные баллы, проверьте подключение к Интернету. Наличие Интернета в Вашем смартфоне является необходимым условием для того, чтобы вы могли видеть Ваш актуальный баланс.'}, {id: 4, question: 'Как использовать мой промо-код для начисления баллов?', answer: 'После того, как Вы передали свой промо-код своему другу, Вам будут начислены баллы в нескольких случаях: <ul><li>Ваш друг установил приложение</li><li>Ваш друг посетил ресторан и сделал заказ</li><li>Количество начисляемых баллов во втором случае будет больше, чем в первом. После того, как Ваш друг скачал приложение, он должен будет зарегистрировать свою карту постоянного гостя. При регистрации приложение предложит ввести промо-код.</li></ul>'}, {id: 5, question: 'Как мне перенести накопленные баллы если я поменял телефон?', answer: 'Все накопленные баллы привязаны к вашему номеру телефона. Скачайте приложение заново и зарегистрируйте свою карту заново на тот же номер телефона. Все баллы восстановятся в приложении. Если вы не видите баллы после регистрации, закройте приложение и откройте его заново. В данном случае обязательно наличие Интернета в Вашем смартфоне.'}, {id: 6, question: 'Какой срок хранения бонусных баллов, и происходит ли их обнуление?', answer: 'Обнуление бонусных баллов происходит каждые 6 месяцев.'}, {id: 7, question: 'Я вожу номер телефона а sms кодом не приходит, что делать?', answer: 'Скорость доставки sms сообщения с кодом зависит от sms-провайдера. К сожалению, иногда время доставки может достигать 30-ти минут. Если Вы не хотите ждать, пожалуйста обратитесь в службу технической поддержки по телефону: +375293803734'}, {id: 8, question: 'Могу ли я изменить свои регистрационные данные после того как привязал номер телефона?', answer: 'После того, как Вы ввели свои данные в анкете, в личном кабинете Вы сможете изменить любую информацию о себе кроме телефона.'}];

  }

  startCheck() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql('SELECT * FROM users WHERE user_id = ?', [1])
        .then(suc => {
          this.myid = suc.rows.item(0).user_real_id;
          // CHECK AND REGISTER FOR PUSH-NOTIFICATION
          this.regPush();
          // UPDATE USER ONLINE
          let queryPoints = "SELECT * FROM points ORDER BY points_when DESC LIMIT 1";
          this.database.executeSql(queryPoints, []).then(sucpoint => {
            if(sucpoint.rows.length > 0) {
              this.lastpoints = sucpoint.rows.item(0).points_when;
            }
          })
          .catch(() => {});

          let queryWallet = "SELECT * FROM wallet ORDER BY wallet_when DESC LIMIT 1";
          this.database.executeSql(queryWallet, []).then(sucwall => {
            if(sucwall.rows.length > 0) {
              this.lastwallet = sucwall.rows.item(0).wallet_when;
            }
          }).catch(() => {});

          let queryGoods = "SELECT * FROM goods ORDER BY goods_when DESC LIMIT 1";
          this.database.executeSql(queryGoods, []).then(sucgood => {
            if(sucgood.rows.length > 0) {
              this.lastgoods = sucgood.rows.item(0).goods_when;
            }
          }).catch(() => {});

          let queryCat = "SELECT * FROM categories ORDER BY cat_when DESC LIMIT 1";
          this.database.executeSql(queryCat, []).then(succat => {
            if(succat.rows.length > 0) {
              this.lastcat = succat.rows.item(0).cat_when;
            }
          }).catch(() => {});

          let queryMenue = "SELECT * FROM menue ORDER BY menue_when DESC LIMIT 1";
          this.database.executeSql(queryMenue, []).then(sucmen => {
            if(sucmen.rows.length > 0) {
              this.lastmenue = sucmen.rows.item(0).menue_when;
            }
          }).catch(() => {});

          let queryIngrs = "SELECT * FROM ingredients ORDER BY ingr_when DESC LIMIT 1";
          this.database.executeSql(queryIngrs, []).then(sucingr => {
            if(sucingr.rows.length > 0) {
              this.lastingrs = sucingr.rows.item(0).ingr_when;
            }
          }).catch(() => {});

          let queryNews = "SELECT * FROM news ORDER BY news_when DESC LIMIT 1";
          this.database.executeSql(queryNews, []).then(sucnews => {
            if(sucnews.rows.length > 0) {
              this.lastnews = sucnews.rows.item(0).news_when;
            }
          }).catch(() => {});

          let queryRevs = "SELECT * FROM reviews ORDER BY reviews_when DESC LIMIT 1";
          this.database.executeSql(queryRevs, []).then(sucrev => {
            if(sucrev.rows.length > 0) {
              this.lastrevs = sucrev.rows.item(0).reviews_when;
            }
          }).catch(() => {});

          let queryAsks = "SELECT * FROM asks ORDER BY asks_when DESC LIMIT 1";
          this.database.executeSql(queryAsks, []).then(sucask => {
            if(sucask.rows.length > 0) {
              this.lastasks = sucask.rows.item(0).asks_when;
            }
          }).catch(() => {});

          let queryGifts = "SELECT * FROM gifts ORDER BY gifts_when DESC LIMIT 1";
          this.database.executeSql(queryGifts, []).then(sucgift => {
            if(sucgift.rows.length > 0) {
              this.lastgifts = sucgift.rows.item(0).gifts_when;
            }
          }).catch(() => {});

          let queryChats = "SELECT * FROM chat ORDER BY chat_when DESC LIMIT 1";
          this.database.executeSql(queryChats, []).then(succhat => {
            if(succhat.rows.length > 0) {
              this.lastchat = succhat.rows.item(0).chat_when;
            }
          }).catch(() => {});

          let queryOrdering = "SELECT * FROM ordering ORDER BY order_when DESC LIMIT 1";
          this.database.executeSql(queryOrdering, []).then(sucorder => {
            if(sucorder.rows.length > 0) {
              this.lastorder = sucorder.rows.item(0).order_when;
            }
          }).catch(() => {});

          let queryRooms = "SELECT * FROM rooms ORDER BY room_upd DESC LIMIT 1";
          this.database.executeSql(queryRooms, []).then(sucroom => {
            if(sucroom.rows.length > 0) {
              this.lastroom = sucroom.rows.item(0).room_upd;
            }
          }).catch(() => {});

          let queryFifthGift = "SELECT * FROM fifthgift ORDER BY fifth_when DESC LIMIT 1";
          this.database.executeSql(queryFifthGift, []).then(sucfifth => {
            if(sucfifth.rows.length > 0) {
              this.lastfifthgift = sucfifth.rows.item(0).fifth_when;
            }
          }).catch(() => {});

          let queryReservation = "SELECT * FROM reservation ORDER BY reservation_when DESC LIMIT 1";
          this.database.executeSql(queryReservation, []).then(sucres => {
            if(sucres.rows.length > 0) {
              this.lastreservs = sucres.rows.item(0).reservation_when;
            }
          }).catch(() => {});

          let queryOrganization = "SELECT * FROM organizations ORDER BY org_log DESC LIMIT 1";
          this.database.executeSql(queryOrganization, []).then(sucorg => {
            if(sucorg.rows.length > 0) {
              this.lastorganization = sucorg.rows.item(0).org_log;
            }

            setTimeout(() => {
              
              let updstr = {
                device: this.model,
                device_id: this.uuid,
                device_serial: this.serial,
                device_version: this.version,
                device_os: this.platform,
                inst_id: this.institution,
                points: this.lastpoints,
                wallet: this.lastwallet,
                goods: this.lastgoods,
                cat: this.lastcat,
                menue: this.lastmenue,
                ingrs: this.lastingrs,
                news: this.lastnews,
                revs: this.lastrevs,
                asks: this.lastasks,
                gifts: this.lastgifts,
                chat: this.lastchat,
                order: this.lastorder,
                room: this.lastroom,
                fifthgift: this.lastfifthgift,
                reservs: this.lastreservs,
                organization: this.lastorganization,
                newusr: 'check'
              }
              this.httpRequest(JSON.stringify(updstr))
              .subscribe(updsuc => {
                this.updUser(updsuc, suc.rows.item(0));
                setTimeout(() => {
                  resolve(1);
                }, 1000);
              }, error => {
                console.log('ERROR HTTP REQ '+JSON.stringify(error));
                resolve(0);
              });

            }, 1000);

          })
          .catch(() => {
            this.getInstitutions(this.institution)
            .then(res => {
              if(res) {
                this.companyIcon = this.officePicLink+res[0].org_logo;
              }
            })
            .catch(e => console.log(e));
            resolve(1);
          });

        })
        .catch(er => {
          // CREATE DIRECTORIES
          this.crDir();
          // REGISTER NEW USER ONLINE
          let regstr = {
            device: this.model,
            device_id: this.uuid,
            device_serial: this.serial,
            device_version: this.version,
            device_os: this.platform,
            inst_id: this.institution,
            newusr: 'newusr'
          }
          this.httpRequest(JSON.stringify(regstr))
          .subscribe((data) => {
            
            // CHECK AND REGISTER FOR PUSH-NOTIFICATION
            this.regPush();

            this.newUser(data);
            setTimeout(() => {
              
              resolve(1);

            }, 2000);
            
          }, (error) => {
            resolve(0);
            // console.log('ERROR '+JSON.stringify(error));
          });
        });
      }, 1000);
    });
  }

  getCalender(data, notconf) {
    
    let dataorders = data;

    // DB ORDER
    let orderArr = dataorders[0].ordersArr;
    if(orderArr.length > 0) {
      this.orderArrFuncIns(0, orderArr);
    }

    setTimeout(() => {

      this.getInstitutions(this.institution)
      .then(res => {
        if(res) {
          this.companyIcon = this.officePicLink+res[0].org_logo;
        }
      })
      .catch(e => console.log(e));

    }, 1000);
    
  }

  getWaiter(data, notconf) {
    
    let dataworkers = data;

    // DB WAITERS
    let usrArr = dataworkers[0].usrArr;
    if(usrArr.length > 0) {
      this.usrArrFunc(0, usrArr);
    }

    // DB PROFESSIONS
    let profArr = dataworkers[0].profArr;
    if(profArr.length > 0) {
      this.profArrFunc(0, profArr);
    }

    // DB OFFICE
    let offArr = dataworkers[0].offArr;
    if(offArr.length > 0) {
      this.offArrFunc(0, offArr);
    }

    // DB ROOMS
    let roomArr = dataworkers[0].roomArr;
    if(roomArr.length > 0) {
      this.roomArrFunc(0, roomArr);
    }

    // DB SCHEDULE
    let schArr = dataworkers[0].schArr;
    if(schArr.length > 0) {
      this.schArrFunc(0, schArr);
    }

    let calendstr = {
      device: this.model,
      device_id: this.uuid,
      device_serial: this.serial,
      device_version: this.version,
      device_os: this.platform,
      inst_id: this.institution,
      newusr: 'calender'
    };
    
    this.httpRequest(JSON.stringify(calendstr))
    .subscribe((calendsuc) => {
      this.getCalender(calendsuc, notconf);
    }, (error) => {
      console.log(JSON.stringify(error));
    });
      
  }

  updUser(data, userupd) {
    if(data[0].check == '1') {
      
      // USER LOG
      if(data[0].user_log > '0') {

        let usrlog = data[0].user_log;
        let corrtime: any = this.timezoneAdd(data[0].user_log);
        this.serverdate = new Date(corrtime*1000);
        this.serverdateraw = data[0].user_log;
        setTimeout(() => {
          // every day 2 weeks
          for(let i=0;i<14;i++) {
            this.dates.push({dat: this.crnewdate(this.serverdate, i)});
          }
        }, 200);

        let queryUsrLog = "SELECT * FROM users WHERE user_id=? AND user_log=? LIMIT 1";
        this.database.executeSql(queryUsrLog, [1, usrlog]).then(suc => {
          if(suc.rows.length == 0) {
            
            let queryUsrLogUpd = "UPDATE users SET user_log=? WHERE user_id=?";
            this.database.executeSql(queryUsrLogUpd, [usrlog, 1])
            .then(suc => {})
            .catch(() => {});

          }
        }).catch(() => {});

      }

      // USER DISCOUNT
      if(data[0].user_discount > '0') {

        let usrdiscount = data[0].user_discount;

        let queryUsrDiscount = "SELECT * FROM users WHERE user_id=? AND user_discount=? LIMIT 1";
        this.database.executeSql(queryUsrDiscount, [1, usrdiscount])
        .then(suc => {
          if(suc.rows.length == 0) {
            
            let queryUsrDiscountUpd = "UPDATE users SET user_discount=? WHERE user_id=?";
            this.database.executeSql(queryUsrDiscountUpd, [usrdiscount, 1])
            .then(suc => {
              
              // $ionicPopup.alert({
              //   title 'Внимание',
              //   template 'Дисконтная карта добавленна!'
              // });

            })
            .catch(() => {});

          }
        })
        .catch(() => {});

      }

      // USER WORK POSITION
      if(data[0].user_work_pos >= '2') {

        // alert(data[0].user_discount);

        let user_work_pos = data[0].user_work_pos;

        let queryUsrWP = "SELECT * FROM users WHERE user_id=? AND user_work_pos=? LIMIT 1";
        this.database.executeSql(queryUsrWP, [1, user_work_pos])
        .then(suc => {
          if(suc.rows.length == 0) {
            
            let queryUsrWPUpd = "UPDATE users SET user_work_pos=? WHERE user_id=?";
            this.database.executeSql(queryUsrWPUpd, [user_work_pos, 1])
            .then(suc => {

              // $ionicPopup.alert({
              //   title 'Внимание',
              //   template 'Вы заблокированны!'
              // });

            })
            .catch(() => {});

          }
        })
        .catch(() => {});

      }
      // IF NO CONNECTION TO DB OR SERVER IS DOWN
      else if(data[0].user_work_pos != '1000') {

        let user_work_pos = data[0].user_work_pos;

        let queryUsrWP = "SELECT * FROM users WHERE user_id=? AND user_work_pos=? LIMIT 1";
        this.database.executeSql(queryUsrWP, [1, user_work_pos])
        .then(suc => {
          if(suc.rows.length == 0) {
            
            let queryUsrWPUpd = "UPDATE users SET user_work_pos=? WHERE user_id=?";
            this.database.executeSql(queryUsrWPUpd, [user_work_pos, 1])
            .then(suc => {

              // $ionicPopup.alert({
              //   title 'Внимание',
              //   template 'Вы разблокированны!'
              // });

            })
            .catch(() => {});

          }
        })
        .catch(() => {});

      }
      
      // USER DATA UPDATE IF ON PHONE IS OLDER THAN ONLINE
      if(data[0].user_upd > userupd.user_upd && data[0].user_id > 0) {

        let user_id = data[0].user_id;
        let user_name = data[0].user_name;
        let user_surname = data[0].user_surname;
        let user_middlename = data[0].user_middlename;
        let user_email = data[0].user_email;
        let user_email_confirm = data[0].user_email_confirm;
        let user_pwd = data[0].user_pwd;
        let user_tel = data[0].user_tel;
        let user_mob_confirm = data[0].user_mob_confirm;
        let user_mob = data[0].user_mob;
        let user_info = data[0].user_info;
        let user_work_pos = data[0].user_work_pos;
        let user_menue_exe = data[0].user_menue_exe;
        let user_institution = data[0].user_institution;
        let user_office = data[0].user_office;
        let user_pic = data[0].user_pic;
        let user_gender = data[0].user_gender;
        let user_birthday = data[0].user_birthday;
        let user_country = data[0].user_country;
        let user_region = data[0].user_region;
        let user_city = data[0].user_city;
        let user_adress = data[0].user_adress;
        let user_install_where = data[0].user_install_where;
        let user_log_key = data[0].user_log_key;
        let user_gcm = data[0].user_gcm;
        let user_device = data[0].user_device;
        let user_device_id = data[0].user_device_id;
        let user_device_serial = data[0].user_device_serial;
        let user_device_version = data[0].user_device_version;
        let user_device_os = data[0].user_device_os;
        let user_discount = data[0].user_discount;
        let user_promo = data[0].user_promo;
        let user_conf_req = data[0].user_conf_req;
        let user_log = data[0].user_log;
        let user_upd = data[0].user_upd;
        let user_reg = data[0].user_reg;
        let user_del = data[0].user_del;

        let queryUsrLog = "SELECT * FROM users WHERE user_id=? LIMIT 1";
        this.database.executeSql(queryUsrLog, [1])
        .then(suc => {
          if(suc.rows.length > 0) {
            
            let queryUsrDataUpd = "UPDATE users SET user_real_id=?, user_name=?, user_surname=?, user_middlename=?, user_email=?, user_email_confirm=?, user_pwd=?, user_tel=?, user_mob_confirm=?, user_mob=?, user_info=?, user_work_pos=?, user_menue_exe=?, user_institution=?, user_office=?, user_pic=?, user_gender=?, user_birthday=?, user_country=?, user_region=?, user_city=?, user_adress=?, user_install_where=?, user_log_key=?, user_gcm=?, user_device=?, user_device_id=?, user_device_serial=?, user_device_version=?, user_device_os=?, user_discount=?, user_promo=?, user_conf_req=?, user_log=?, user_upd=?, user_reg=?, user_del=? WHERE user_id=?";
            this.database.executeSql(queryUsrDataUpd, [user_id, user_name, user_surname, user_middlename, user_email, user_email_confirm, user_pwd, user_tel, user_mob_confirm, user_mob, user_info, user_work_pos, user_menue_exe, user_institution, user_office, user_pic, user_gender, user_birthday, user_country, user_region, user_city, user_adress, user_install_where, user_log_key, user_gcm, user_device, user_device_id, user_device_serial, user_device_version, user_device_os, user_discount, user_promo, user_conf_req, user_log, user_upd, user_reg, user_del, 1])
            .then(suc => {})
            .catch(() => {});

          }
        })
        .catch(() => {});

      }

      // DB POINTS
      let pointsArr = data[0].pointsArr;
      if(pointsArr.length > 0) {
        this.pointsArrFunc(0, pointsArr);
      }

      // DB WALLET
      let walletArr = data[0].walletArr;
      if(walletArr.length > 0) {

        let wallet_user = data[0].walletArr[0]['wallet_user'];
        let wallet_institution = data[0].walletArr[0]['wallet_institution'];
        let wallet_total = data[0].walletArr[0]['wallet_total'];
        let wallet_warn = data[0].walletArr[0]['wallet_warn'];
        let wallet_when = data[0].walletArr[0]['wallet_when'];
        let wallet_del = data[0].walletArr[0]['wallet_del'];

        let queryWallet = "SELECT * FROM wallet WHERE wallet_when < ?";
        this.database.executeSql(queryWallet, [wallet_when])
        .then(suc => {
          if(suc.rows.length > 0) {
            let walletUpd = "UPDATE wallet SET wallet_institution=?, wallet_total=?, wallet_when=?, wallet_warn=?, wallet_del=?  WHERE wallet_user=?";
            this.database.executeSql(walletUpd, [wallet_institution, wallet_total, wallet_when, wallet_warn, wallet_del, wallet_user])
            .then(() => {})
            .catch(() => {});
          }
        })
        .catch(() => {});

      }

      // DB GOODS
      let goodsArr = data[0].goodsArr;
      if(goodsArr.length > 0) {
        this.goodsArrFunc(0, goodsArr);
      }

      // DB CATEGORIES
      let catArr = data[0].catArr;
      if(catArr.length > 0) {
        this.catArrFunc(0, catArr);
      }

      // DB MENU
      let menueArr = data[0].menueArr;
      if(menueArr.length > 0) {
        this.menueArrFunc(0, menueArr);
      }

      // DB INGREDIENTS
      let ingrArr = data[0].ingrArr;
      if(ingrArr.length > 0) {
        this.ingrArrFunc(0, ingrArr);
      }

      // DB NEWS
      let newsArr = data[0].newsArr;
      if(newsArr.length > 0) {
        this.newsArrFunc(0, newsArr);
      }

      // DB REVIEWS
      let reviewsArr = data[0].reviewsArr;
      if(reviewsArr.length > 0) {
        this.reviewsArrFunc(0, reviewsArr);
      }

      // DB ASKS
      let asksArr = data[0].asksArr;
      
      if(asksArr.length > 0) {
        this.asksArrFunc(0, asksArr);
      }

      // DB GIFTS
      let giftsArr = data[0].giftsArr;
      if(giftsArr.length > 0) {
        this.giftsArrFunc(0, giftsArr);
      }

      // DB CHAT
      let chatArr = data[0].chatArr;
      if(chatArr.length > 0) {
        this.chatArrFunc(0, chatArr);
      }

      // DB FIFTHGIFT
      let fifthArr = data[0].fifthArr;
      if(fifthArr.length > 0) {
        this.fifthArrFunc(0, fifthArr);
      }

      // DB RESERVATION
      let reservArr = data[0].reservArr;
      if(reservArr.length > 0) {
        this.reservArrFunc(0, reservArr);
      }

      // DB ORGANIZATION
      let orgArr = data[0].orgArr;
      if(orgArr.length > 0) {
        this.orgArrFunc(0, orgArr);
      }

      setTimeout(() => {

        let waiterstr = {
          inst_id: this.institution,
          newusr: 'waiter'
        }
        this.httpRequest(JSON.stringify(waiterstr))
        .subscribe((waitsuc) => {
          if(userupd.user_mob_confirm == 1 && this.validateEmail(userupd.user_email) && userupd.user_name) {
            this.getWaiter(waitsuc, 1);
          }
          else {
            this.getWaiter(waitsuc, 0);
          }
        }, (error) => {
          console.log(JSON.stringify(error));
        });

      }, 2000);

    }
  }

  newUser(data) {
    
    // DB USER
    this.database.executeSql("CREATE TABLE IF NOT EXISTS users (user_id integer primary key, user_real_id integer, user_name text, user_surname text, user_middlename text, user_email text, user_email_confirm text, user_pwd text, user_tel integer, user_mob_confirm text, user_mob integer, user_info text, user_work_pos integer, user_menue_exe text, user_institution integer, user_office integer, user_pic text, user_gender integer, user_birthday text, user_country integer, user_region integer, user_city integer, user_adress text, user_install_where integer, user_log_key text, user_gcm text, user_device text, user_device_id text, user_device_serial text, user_device_version text, user_device_os text, user_discount text, user_promo integer, user_conf_req integer, user_log integer, user_upd integer, user_reg integer, user_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {

        let user_id = data[0].usrData['user_id'];
        let user_name = data[0].usrData['user_name'];
        let user_surname = data[0].usrData['user_surname'];
        let user_middlename = data[0].usrData['user_middlename'];
        let user_email = data[0].usrData['user_email'];
        let user_email_confirm = data[0].usrData['user_email_confirm'];
        let user_pwd = data[0].usrData['user_pwd'];
        let user_tel = data[0].usrData['user_tel'];
        let user_mob_confirm = data[0].usrData['user_mob_confirm'];
        let user_mob = data[0].usrData['user_mob'];
        let user_info = data[0].usrData['user_info'];
        let user_work_pos = data[0].usrData['user_work_pos'];
        let user_menue_exe = data[0].usrData['user_menue_exe'];
        let user_institution = data[0].usrData['user_institution'];
        let user_office = data[0].usrData['user_office'];
        let user_pic = data[0].usrData['user_pic'];
        let user_gender = data[0].usrData['user_gender'];
        let user_birthday = data[0].usrData['user_birthday'];
        let user_country = data[0].usrData['user_country'];
        let user_region = data[0].usrData['user_region'];
        let user_city = data[0].usrData['user_city'];
        let user_adress = data[0].usrData['user_adress'];
        let user_install_where = data[0].usrData['user_install_where'];
        let user_log_key = data[0].usrData['user_log_key'];
        let user_gcm = data[0].usrData['user_gcm'];
        let user_device = data[0].usrData['user_device'];
        let user_device_id = data[0].usrData['user_device_id'];
        let user_device_serial = data[0].usrData['user_device_serial'];
        let user_device_version = data[0].usrData['user_device_version'];
        let user_device_os = data[0].usrData['user_device_os'];
        let user_discount = data[0].usrData['user_discount'];
        let user_promo = data[0].usrData['user_promo'];
        let user_conf_req = data[0].usrData['user_conf_req'];
        let user_log = data[0].usrData['user_log'];
        let user_upd = data[0].usrData['user_upd'];
        let user_reg = data[0].usrData['user_reg'];
        let user_del = data[0].usrData['user_del'];

        let corrtime: any = this.timezoneAdd(data[0].usrData['user_log']);
        this.serverdate = new Date(corrtime*1000);
        this.serverdateraw = data[0].usrData['user_log'];
        setTimeout(() => {
          // every day 2 weeks
          for(let i=0;i<14;i++) {
            this.dates.push({dat: this.crnewdate(this.serverdate, i)});
          }
        }, 200);

        // DB USER
        let usrIns = "INSERT INTO users (user_id, user_real_id, user_name, user_surname, user_middlename, user_email, user_email_confirm, user_pwd, user_tel, user_mob_confirm, user_mob, user_info, user_work_pos, user_menue_exe, user_institution, user_office, user_pic, user_gender, user_birthday, user_country, user_region, user_city, user_adress, user_install_where, user_log_key, user_gcm, user_device, user_device_id, user_device_serial, user_device_version, user_device_os, user_discount, user_promo, user_conf_req, user_log, user_upd, user_reg, user_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(usrIns, [1, user_id, user_name, user_surname, user_middlename, user_email, user_email_confirm, user_pwd, user_tel, user_mob_confirm, user_mob, user_info, user_work_pos, user_menue_exe, user_institution, user_office, user_pic, user_gender, user_birthday, user_country, user_region, user_city, user_adress, user_install_where, user_log_key, user_gcm, user_device, user_device_id, user_device_serial, user_device_version, user_device_os, user_discount, user_promo, user_conf_req, user_log, user_upd, user_reg, user_del]).then(() => {

          this.myid = user_id;

          setTimeout(() => {

            let waiterstr = {
              inst_id: this.institution,
              newusr: 'waiter'
            }
            this.httpRequest(JSON.stringify(waiterstr))
            .subscribe((waitsuc) => {
              this.getWaiter(waitsuc, user_mob_confirm);
            }, (error) => {
              console.log(JSON.stringify(error));
            });

          }, 2000);

        })
        .catch(() => {});

      }
    })
    .catch(() => {});

    // DB COUNTRY
    this.database.executeSql("CREATE TABLE IF NOT EXISTS country (id_country integer primary key, name text, country_del integer)", {})
    .then(() => {})
    .catch(() => {});

    // DB REGION
    this.database.executeSql("CREATE TABLE IF NOT EXISTS region (id_region integer primary key, id_country integer, name text, region_del integer)", {})
    .then(() => {})
    .catch(() => {});

    // DB CITY
    this.database.executeSql("CREATE TABLE IF NOT EXISTS city (id_city integer primary key, id_region integer, id_country integer, name text, city_del integer)", {})
    .then(() => {})
    .catch(() => {});

    // DB POINTS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS points (points_id integer primary key, points_user integer, points_bill integer, points_discount integer, points_points integer, points_got_spend integer, points_waiter integer, points_institution integer, points_office integer,points_status integer, points_comment integer, points_proofed integer, points_gift integer, points_check integer, points_waitertime integer, points_usertime integer, points_when integer, points_time integer, points_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {

          // DB POINTS
        let pointsArr = data[0].pointsArr;
        
        if(pointsArr.length > 0) {
          this.pointsArrFuncIns(0, pointsArr);
        }

      }
    })
    .catch(() => {});

    // DB WALLET
    this.database.executeSql("CREATE TABLE IF NOT EXISTS wallet (wallet_id integer primary key, wallet_user integer, wallet_institution integer, wallet_total integer, wallet_warn integer, wallet_when integer, wallet_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {
          // DB WALLET
        let walletArr = data[0].walletArr;

        if(walletArr.length > 0) {

          let wallet_user = data[0].walletArr[0]['wallet_user'];
          let wallet_institution = data[0].walletArr[0]['wallet_institution'];
          let wallet_total = data[0].walletArr[0]['wallet_total'];
          let wallet_warn = data[0].walletArr[0]['wallet_warn'];
          let wallet_when = data[0].walletArr[0]['wallet_when'];
          let wallet_del = data[0].walletArr[0]['wallet_del'];

          let walletIns = "INSERT INTO wallet (wallet_user, wallet_institution, wallet_total, wallet_warn, wallet_when, wallet_del) VALUES (?,?,?,?,?,?)";
          this.database.executeSql(walletIns, [wallet_user, wallet_institution, wallet_total, wallet_warn, wallet_when, wallet_del])
          .then(() => {})
          .catch(() => {});

        }
      }
    })
    .catch(() => {});

    // DB GOODS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS goods (goods_id integer primary key, goods_name text, goods_desc text, goods_pic text, goods_type integer, goods_institution integer, goods_when integer, goods_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {
        // DB GOODS
        let goodsArr = data[0].goodsArr;

        if(goodsArr.length > 0) {
          this.goodsArrFuncIns(0, goodsArr);
        }
      }
    })
    .catch(() => {});

    // DB CATEGORIES
    this.database.executeSql("CREATE TABLE IF NOT EXISTS categories (cat_id integer primary key, cat_xid text, cat_name text, cat_desc text, cat_pic text, cat_ingr integer, cat_order integer, cat_institution integer, cat_when integer, cat_del integer)", {}).then(() => {
        if(data[0].newusr == '1') {
          // DB CATEGORIES
          let catArr = data[0].catArr;

          if(catArr.length > 0) {
            this.catArrFuncIns(0, catArr);
          }
        }
    })
    .catch(() => {});

    // DB MENUE
    this.database.executeSql("CREATE TABLE IF NOT EXISTS menue (menue_id integer primary key, menue_xid text, menue_cat_xid text, menue_cat integer, menue_name text, menue_desc text, menue_size integer, menue_cost integer, menue_costs text, menue_ingr text, menue_addition text, menue_addition_auto integer, menue_package text, menue_weight integer, menue_interval integer, menue_discount integer, menue_action text, menue_code text, menue_pic text, menue_icon text, menue_institution integer, menue_when integer, menue_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {
        // DB MENU
        let menueArr = data[0].menueArr;
        
        if(menueArr.length > 0) {
          this.menueArrFuncIns(0, menueArr);
        }
      }
    })
    .catch(() => {});

    // DB GIFTS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS gifts (gifts_id integer primary key, gifts_name text, gifts_desc text, gifts_points integer, gifts_pic text, gifts_icon text, gifts_institution integer, gifts_when integer, gifts_del integer)", {})
    .then(() => {
        if(data[0].newusr == '1') {
          // DB GIFTS
          let giftsArr = data[0].giftsArr;
          
          if(giftsArr.length > 0) {
            this.giftsArrFuncIns(0, giftsArr);
          }
        }
    })
    .catch(() => {});

    // DB INGREDIENTS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS ingredients (ingr_id integer primary key, ingr_xid text, ingr_name text, ingr_desc text, ingr_cat integer, ingr_code text, ingr_pic text, ingr_size integer, ingr_cost integer, ingr_institution integer, ingr_when integer, ingr_del)", {}).then(() => {
        if(data[0].newusr == '1') {
          // DB INGREDIENTS
          let ingrArr = data[0].ingrArr;

          if(ingrArr.length > 0) {
            this.ingrArrFuncIns(0, ingrArr);
          }
        }
    })
    .catch(() => {});

    // DB NEWS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS news (news_id integer primary key, news_name text, news_message text, news_pic text, news_institution integer, news_state integer, news_menue_id integer, news_cost integer, news_user integer, news_used integer, news_begin integer, news_end integer, news_when integer, news_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {
        // DB NEWS
        let newsArr = data[0].newsArr;

        if(newsArr.length > 0) {
          this.newsArrFuncIns(0, newsArr);
        }
      }
    })
    .catch(() => {});

    // DB REVIEWS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS reviews (reviews_id integer primary key, reviews_from integer, reviews_to integer, reviews_message text, reviews_pic text, reviews_institution integer, reviews_answered integer, reviews_opened integer, reviews_when integer, reviews_del integer)", {}).then(() => {
        if(data[0].newusr == '1') {
          // DB REVIEWS
          let reviewsArr = data[0].reviewsArr;

          if(reviewsArr.length > 0) {
            this.reviewsArrFuncIns(0, reviewsArr);
          }
        }
    })
    .catch(() => {});

    // DB ASKS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS asks (asks_id integer primary key, asks_name text, asks_message text, asks_type integer, asks_chained integer, asks_active integer, asks_img text, asks_answ text, asks_yes integer, asks_no integer, asks_reply text, asks_institution integer, asks_when integer, asks_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {
        // DB ASKS
        let asksArr = data[0].asksArr;

        if(asksArr.length > 0) {
          this.asksArrFuncIns(0, asksArr);
        }
      }
    })
    .catch(() => {});

    // DB CHAT
    this.database.executeSql("CREATE TABLE IF NOT EXISTS chat (chat_id integer primary key, chat_from integer, chat_to integer, chat_name text, chat_message text, chat_read integer, chat_institution integer, chat_answered integer, chat_when integer, chat_del integer)", {}).then(() => {
      if(data[0].newusr == '1') {
        // DB CHAT
        let chatArr = data[0].chatArr;
        
        if(chatArr.length > 0) {
          this.chatArrFuncIns(0, chatArr);
        }
      }
    })
    .catch(() => {});

    // DB ORDER
    this.database.executeSql("CREATE TABLE IF NOT EXISTS ordering (order_id integer primary key, order_user text, order_user_name_phone text, order_user_surname_phone text, order_user_middlename_phone text, order_user_adress_phone text, order_user_comment_phone text, order_name text, order_name_phone text, order_user_phone_phone text, order_user_email_phone text, order_desc text, order_worker integer, order_worker_name_phone text, order_worker_pic_phone text, order_worker_profession_phone text, order_reminder_phone text, order_institution integer, order_office integer, order_room integer, order_bill integer, order_goods integer, order_cats integer, order_order text, order_status integer, order_start integer, order_start_name_phone text, order_end integer, order_allday integer, order_mobile integer, order_mobile_confirm text, order_when integer, order_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {

      }
    })
    .catch(() => {});

    // DB PROFESSIONS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS professions (prof_id integer primary key, prof_name text, prof_desc text, prof_institution integer, prof_when integer, prof_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {

      }
    })
    .catch(() => {});

    // DB OFFICES
    this.database.executeSql("CREATE TABLE IF NOT EXISTS organizations_office (office_id integer primary key, office_name text, office_start text, office_stop text, office_bus_hours text, office_country integer, office_city text, office_adress text, office_lat text, office_lon text, office_desc text, office_timezone integer, office_tel text, office_tel_n text, office_fax integer, office_mob integer, office_email text,office_pwd text, office_goods text, office_categories text, office_menue text, office_orders integer, office_skype text, office_site text, office_tax_id text, office_logo text, office_institution integer, office_log integer, office_reg integer, office_del integer)", {}).then(() => {
      if(data[0].newusr == '1') {

      }
    })
    .catch(() => {});

    // DB SCHEDULE
    this.database.executeSql("CREATE TABLE IF NOT EXISTS schedule (schedule_id integer primary key, schedule_employee integer, schedule_menue integer, schedule_office integer, schedule_start integer, schedule_stop integer, schedule_institution integer, schedule_when integer, schedule_del integer)", {}).then(() => {
      if(data[0].newusr == '1') {

      }
    })
    .catch(() => {});

    // DB FIFTHGIFT
    this.database.executeSql("CREATE TABLE IF NOT EXISTS fifthgift (fifth_id integer primary key, fifth_name text, fifth_desc text, fifth_user integer, fifth_menue_id integer, fifth_bill integer, fifth_got_spend integer, fifth_institution integer, fifth_office integer, fifth_when integer, fifth_del integer)", {})
    .then(() => {
      
      if(data[0].newusr == '1') {

        let fifthArr = data[0].fifthArr;
        
        if(fifthArr.length > 0) {
          this.fifthArrFuncIns(0, fifthArr);
        }

      }

    })
    .catch(() => {});

    // DB RESERVATION
    this.database.executeSql("CREATE TABLE IF NOT EXISTS reservation (reservation_id integer primary key, reservation_userid integer, reservation_surname text, reservation_name text, reservation_middlename text, reservation_mobile integer, reservation_date integer, reservation_time integer, reservation_comment text, reservation_institution integer, reservation_when integer, reservation_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {

        let reservArr = data[0].reservArr;
        
        if(reservArr.length > 0) {
          this.reservArrFuncIns(0, reservArr);
        }

      }

    }).catch(() => {});

    // DB ORGANIZATION
    this.database.executeSql("CREATE TABLE IF NOT EXISTS organizations (org_id integer primary key, org_name text, org_country integer, org_city integer, org_adress text, org_timezone integer, org_tel text, org_fax text, org_mob text, org_email text, org_skype text, org_site text, org_tax_id text, org_logo text, org_sound integer, org_development integer, org_money_points integer, org_starting_points integer, org_money_percent integer, org_points_points integer, org_promo_points_owner integer, org_promo_points_scan_owner integer, org_promo_points_involved integer, org_promo_points_scan_involved integer, org_max_points integer, org_risk_summ integer, org_autoaprove integer, org_appvers integer, org_appurl text, org_log integer, org_reg integer, org_del integer)", {})
    .then(() => {
      if(data[0].newusr == '1') {

        // DB ORGANIZATION
        let orgArr = data[0].orgArr;
        
        if(orgArr.length > 0) {
          this.orgArrFuncIns(0, orgArr);
        }

      }
    })
    .catch(() => {});

    // DB ROOMS
    this.database.executeSql("CREATE TABLE IF NOT EXISTS rooms (room_id integer primary key, room_name text, room_desc text, room_employee integer, room_menue_exe text, room_priority integer, room_institution integer, room_office integer, room_upd integer, room_when integer, room_del integer)", {}).then(() => {})
    .catch(() => {});

  }

  orderArrFuncIns(id, orderArr) {
    
    let order_id = orderArr[id]['order_id'];
    let order_user = orderArr[id]['order_user'];
    let order_user_name_phone = orderArr[id]['order_user_name_phone'];
    let order_user_surname_phone = orderArr[id]['order_user_surname_phone'];
    let order_user_middlename_phone = orderArr[id]['order_user_middlename_phone'];
    let order_user_adress_phone = orderArr[id]['order_user_adress_phone'];
    let order_user_comment_phone = orderArr[id]['order_user_comment_phone'];
    let order_name = orderArr[id]['order_name'];
    let order_name_phone = orderArr[id]['order_name_phone'];
    let order_user_phone_phone = orderArr[id]['order_user_phone_phone'];
    let order_user_email_phone = orderArr[id]['order_user_email_phone'];
    let order_desc = orderArr[id]['order_desc'];
    let order_worker = orderArr[id]['order_worker'];
    let order_worker_name_phone = orderArr[id]['order_worker_name_phone'];
    let order_worker_pic_phone = orderArr[id]['order_worker_pic_phone'];
    let order_worker_profession_phone = orderArr[id]['order_worker_profession_phone'];
    let order_reminder_phone = orderArr[id]['order_reminder_phone'];
    let order_institution = orderArr[id]['order_institution'];
    let order_office = orderArr[id]['order_office'];
    let order_room = orderArr[id]['order_room'];
    let order_bill = orderArr[id]['order_bill'];
    let order_goods = orderArr[id]['order_goods'];
    let order_cats = orderArr[id]['order_cats'];
    let order_order = orderArr[id]['order_order'];
    let order_status = orderArr[id]['order_status'];
    let order_start = orderArr[id]['order_start'];
    let order_start_name_phone = orderArr[id]['order_start_name_phone'];
    let order_end = orderArr[id]['order_end'];
    let order_allday = orderArr[id]['order_allday'];
    let order_mobile_confirm = orderArr[id]['order_mobile_confirm'];
    let order_mobile = orderArr[id]['order_mobile'];
    let order_when = orderArr[id]['order_when'];
    let order_del = orderArr[id]['order_del'];

    let queryOrdering = "SELECT * FROM ordering WHERE order_id = ?";
    this.database.executeSql(queryOrdering, [order_id])
    .then(suc => {
      if(suc.rows.length > 0) {

        // DB ORDERS
        let orderingUpd = "UPDATE ordering SET order_user=?, order_user_name_phone=?, order_user_surname_phone=?, order_user_middlename_phone=?, order_user_adress_phone=?, order_user_comment_phone=?, order_name=?, order_name_phone=?, order_user_phone_phone=?, order_user_email_phone=?, order_desc=?, order_worker=?, order_worker_name_phone=?, order_worker_pic_phone=?, order_worker_profession_phone=?, order_reminder_phone=?, order_institution=?, order_office=?, order_room=?, order_bill=?, order_goods=?, order_cats=?, order_order=?, order_status=?,  order_start=?, order_start_name_phone=?, order_end=?, order_allday=?, order_mobile_confirm=?, order_mobile=?, order_when=?, order_del=? WHERE order_id=?";
        this.database.executeSql(orderingUpd, [order_user, order_user_name_phone, order_user_surname_phone, order_user_middlename_phone, order_user_adress_phone, order_user_comment_phone, order_name, order_name_phone, order_user_phone_phone, order_user_email_phone, order_desc, order_worker, order_worker_name_phone, order_worker_pic_phone, order_worker_profession_phone, order_reminder_phone, order_institution, order_office, order_room, order_bill, order_goods, order_cats, order_order, order_status, order_start, order_start_name_phone, order_end, order_allday, order_mobile_confirm, order_mobile, order_when, order_del, order_id])
        .then(() => {
          id++;
          if(id < orderArr.length) {
            this.orderArrFuncIns(id, orderArr);
          }
        })
        .catch(() => {});

      }
      else {

        let orderIns = "INSERT INTO ordering (order_id, order_user, order_user_name_phone, order_user_surname_phone, order_user_middlename_phone, order_user_adress_phone, order_user_comment_phone, order_name, order_name_phone, order_user_phone_phone, order_user_email_phone, order_desc, order_worker, order_worker_name_phone, order_worker_pic_phone, order_worker_profession_phone, order_reminder_phone, order_institution, order_office, order_room, order_bill, order_goods, order_cats, order_order, order_status, order_start, order_start_name_phone, order_end, order_allday, order_mobile_confirm, order_mobile, order_when, order_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(orderIns, [order_id, order_user, order_user_name_phone, order_user_surname_phone, order_user_middlename_phone, order_user_adress_phone, order_user_comment_phone, order_name, order_name_phone, order_user_phone_phone, order_user_email_phone, order_desc, order_worker, order_worker_name_phone, order_worker_pic_phone, order_worker_profession_phone, order_reminder_phone, order_institution, order_office, order_room, order_bill, order_goods, order_cats, order_order, order_status, order_start, order_start_name_phone, order_end, order_allday, order_mobile_confirm, order_mobile, order_when, order_del])
        .then((ins) => {
          id++;
          if(id < orderArr.length) {
            this.orderArrFuncIns(id, orderArr);
          }
        })
        .catch(() => {});

      }
    })
    .catch(() => {});

  }

  schArrFunc(id, schArr) {
    
    let schedule_id = schArr[id]['schedule_id'];
    let schedule_employee = schArr[id]['schedule_employee'];
    let schedule_menue = schArr[id]['schedule_menue'];
    let schedule_office = schArr[id]['schedule_office'];
    let schedule_start = schArr[id]['schedule_start'];
    let schedule_stop = schArr[id]['schedule_stop'];
    let schedule_institution = schArr[id]['schedule_institution'];
    let schedule_when = schArr[id]['schedule_when'];
    let schedule_del = schArr[id]['schedule_del'];

    let querySchedule = "SELECT * FROM schedule WHERE schedule_id = ?";
    this.database.executeSql(querySchedule, [schedule_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        // DB SCHEDULE
        let scheduleUpd = "UPDATE schedule SET schedule_employee=?, schedule_menue=?, schedule_office=?, schedule_start=?, schedule_stop=?, schedule_institution=?, schedule_when=?, schedule_del=? WHERE schedule_id=?";
        this.database.executeSql(scheduleUpd, [schedule_employee, schedule_menue, schedule_office, schedule_start, schedule_stop, schedule_institution, schedule_when, schedule_del, schedule_id])
        .then(() => {
          id++;
          if(id < schArr.length) {
            this.schArrFunc(id, schArr);
          }
        })
        .catch(() => {});
      }
      else {
        // DB SCHEDULE
        let scheduleIns = "INSERT INTO schedule (schedule_id, schedule_employee, schedule_menue, schedule_office, schedule_start, schedule_stop, schedule_institution, schedule_when, schedule_del) VALUES (?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(scheduleIns, [schedule_id, schedule_employee, schedule_menue, schedule_office, schedule_start, schedule_stop, schedule_institution, schedule_when, schedule_del])
        .then(() => {
          id++;
          if(id < schArr.length) {
            this.schArrFunc(id, schArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  roomArrFunc(id, roomArr) {
    
    let room_id = roomArr[id]['room_id'];
    let room_name = roomArr[id]['room_name'];
    let room_desc = roomArr[id]['room_desc'];
    let room_employee = roomArr[id]['room_employee'];
    let room_menue_exe = roomArr[id]['room_menue_exe'];
    let room_priority = roomArr[id]['room_priority'];
    let room_institution = roomArr[id]['room_institution'];
    let room_office = roomArr[id]['room_office'];
    let room_upd = roomArr[id]['room_upd'];
    let room_when = roomArr[id]['room_when'];
    let room_del = roomArr[id]['room_del'];

    let queryRooms = "SELECT * FROM rooms WHERE room_id = ?";
    this.database.executeSql(queryRooms, [room_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        // DB ROOMS
        let roomUpd = "UPDATE rooms SET room_name=?, room_desc=?, room_employee=?, room_menue_exe=?, room_priority=?, room_institution=?, room_office=?, room_upd=?, room_when=?, room_del=? WHERE room_id=?";
        this.database.executeSql(roomUpd, [room_name, room_desc, room_employee, room_menue_exe, room_priority, room_institution, room_office, room_upd, room_when, room_del, room_id])
        .then(() => {
          // alert('upd ok')
          id++;
          if(id < roomArr.length) {
            this.roomArrFunc(id, roomArr);
          }
        })
        .catch(() => {});
      }
      else {
        // DB ROOMS
        let roomIns = "INSERT INTO rooms (room_id, room_name, room_desc, room_employee, room_menue_exe, room_priority, room_institution, room_office, room_upd, room_when, room_del) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(roomIns, [room_id, room_name, room_desc, room_employee, room_menue_exe, room_priority, room_institution, room_office, room_upd, room_when, room_del])
        .then(() => {
          // alert('ins ok')
          id++;
          if(id < roomArr.length) {
            this.roomArrFunc(id, roomArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  offArrFunc(id, offArr) {
    
    let office_id = offArr[id]['office_id'];
    let office_name = offArr[id]['office_name'];
    let office_start = offArr[id]['office_start'];
    let office_stop = offArr[id]['office_stop'];
    let office_bus_hours = offArr[id]['office_bus_hours'];
    let office_country = offArr[id]['office_country'];
    let office_city = offArr[id]['office_city'];
    let office_adress = offArr[id]['office_adress'];
    let office_lat = offArr[id]['office_lat'];
    let office_lon = offArr[id]['office_lon'];
    let office_desc = offArr[id]['office_desc'];
    let office_timezone = offArr[id]['office_timezone'];
    let office_tel = offArr[id]['office_tel'];
    let office_tel_n = offArr[id]['office_tel_n'];
    let office_fax = offArr[id]['office_fax'];
    let office_mob = offArr[id]['office_mob'];
    let office_email = offArr[id]['office_email'];
    let office_goods = offArr[id]['office_goods'];
    let office_categories = offArr[id]['office_categories'];
    let office_menue = offArr[id]['office_menue'];
    let office_orders = offArr[id]['office_orders'];
    let office_skype = offArr[id]['office_skype'];
    let office_site = offArr[id]['office_site'];
    let office_logo = offArr[id]['office_logo'];
    let office_institution = offArr[id]['office_institution'];
    let office_del = offArr[id]['office_del'];

    let queryOffice = "SELECT * FROM organizations_office WHERE office_id = ?";
    this.database.executeSql(queryOffice, [office_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        // DB OFFICE
        let officeUpd = "UPDATE organizations_office SET office_name=?, office_start=?, office_stop=?, office_bus_hours=?, office_country=?, office_city=?, office_adress=?, office_lat=?, office_lon=?, office_desc=?, office_timezone=?, office_tel=?, office_tel_n=?, office_fax=?, office_mob=?, office_email=?, office_goods=?, office_categories=?, office_menue=?, office_orders=?, office_skype=?, office_site=?, office_logo=?, office_institution=?, office_del=? WHERE office_id=?";
        this.database.executeSql(officeUpd, [office_name, office_start, office_stop, office_bus_hours, office_country, office_city, office_adress, office_lat, office_lon, office_desc, office_timezone, office_tel, office_tel_n, office_fax, office_mob, office_email, office_goods, office_categories, office_menue, office_orders, office_skype, office_site, office_logo, office_institution, office_del, office_id])
        .then(() => {
          // alert('upd ok')
          id++;
          if(id < offArr.length) {
            this.offArrFunc(id, offArr);
          }
        })
        .catch(() => {});
      }
      else {
        // DB OFFICE
        let officeIns = "INSERT INTO organizations_office (office_id, office_name, office_start, office_stop, office_bus_hours, office_country, office_city, office_adress, office_lat, office_lon, office_desc, office_timezone, office_tel, office_tel_n, office_fax, office_mob, office_email, office_goods, office_categories, office_menue, office_orders, office_skype, office_site, office_logo, office_institution, office_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(officeIns, [office_id, office_name, office_start, office_stop, office_bus_hours, office_country, office_city, office_adress, office_lat, office_lon, office_desc, office_timezone, office_tel, office_tel_n, office_fax, office_mob, office_email, office_goods, office_categories, office_menue, office_orders, office_skype, office_site, office_logo, office_institution, office_del])
        .then(() => {
          // alert('ins ok')
          id++;
          if(id < offArr.length) {
            this.offArrFunc(id, offArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  profArrFunc(id, profArr) {
    
    let prof_id = profArr[id]['prof_id'];
    let prof_name = profArr[id]['prof_name'];
    let prof_desc = profArr[id]['prof_desc'];
    let prof_institution = profArr[id]['prof_institution'];
    let prof_when = profArr[id]['prof_when'];
    let prof_del = profArr[id]['prof_del'];

    let queryProfs = "SELECT * FROM professions WHERE prof_id = ?";
    this.database.executeSql(queryProfs, [prof_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        // DB PROFESSIONS
        let profUpd = "UPDATE professions SET prof_name=?, prof_desc=?, prof_institution=?, prof_when=?, prof_del=? WHERE prof_id=?";
        this.database.executeSql(profUpd, [prof_name, prof_desc, prof_institution, prof_when, prof_del, prof_id])
        .then(() => {
          // alert('upd ok')
          id++;
          if(id < profArr.length) {
            this.profArrFunc(id, profArr);
          }
        })
        .catch(() => {});
      }
      else {
        // DB PROFESSIONS
        let profIns = "INSERT INTO professions (prof_id, prof_name, prof_desc, prof_institution, prof_when, prof_del) VALUES (?,?,?,?,?,?)";
        this.database.executeSql(profIns, [prof_id, prof_name, prof_desc, prof_institution, prof_when, prof_del])
        .then(() => {
          // alert('ins ok')
          id++;
          if(id < profArr.length) {
            this.profArrFunc(id, profArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  usrArrFunc(id, usrArr) {
    
    let user_id = usrArr[id]['user_id'];
    let user_name = usrArr[id]['user_name'];
    let user_surname = usrArr[id]['user_surname'];
    let user_middlename = usrArr[id]['user_middlename'];
    let user_mob = usrArr[id]['user_mob'];
    let user_info = usrArr[id]['user_info'];
    let user_work_pos = usrArr[id]['user_work_pos'];
    let user_menue_exe = usrArr[id]['user_menue_exe'];
    let user_pic = usrArr[id]['user_pic'];
    let user_gender = usrArr[id]['user_gender'];
    let user_institution = usrArr[id]['user_institution'];
    let user_office = usrArr[id]['user_office'];
    let user_reg = usrArr[id]['user_reg'];
    let user_del = usrArr[id]['user_del'];

    let queryWaiters = "SELECT * FROM users WHERE user_real_id = ?";
    this.database.executeSql(queryWaiters, [user_id])
    .then(suc => {

      if(suc.rows.length > 0) {
        // DB WAITERS
        let usrUpd = "UPDATE users SET user_name=?, user_surname=?, user_middlename=?, user_mob=?, user_info=?, user_work_pos=?, user_menue_exe=?, user_pic=?, user_gender=?, user_institution=?, user_office=?, user_reg=?, user_del=? WHERE user_real_id=?";
        this.database.executeSql(usrUpd, [user_name, user_surname, user_middlename, user_mob, user_info, user_work_pos, user_menue_exe, user_pic, user_gender, user_institution, user_office, user_reg, user_del, user_id])
        .then(() => {
          id++;
          if(id < usrArr.length) {
            this.usrArrFunc(id, usrArr);
          }
        })
        .catch(() => {});
      }
      else {
        // DB WAITERS
        let usrIns = "INSERT INTO users (user_real_id, user_name, user_surname, user_middlename, user_mob, user_info, user_work_pos, user_menue_exe, user_pic, user_gender, user_institution, user_office, user_reg, user_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(usrIns, [user_id, user_name, user_surname, user_middlename, user_mob, user_info, user_work_pos, user_menue_exe, user_pic, user_gender, user_institution, user_office, user_reg, user_del])
        .then(() => {
          // alert('ins ok')
          id++;
          if(id < usrArr.length) {
            this.usrArrFunc(id, usrArr);
          }
        })
        .catch(() => {});
      }

    })
    .catch(() => {});

  }

  orgArrFunc(id, orgArr) {
    
    let org_id = orgArr[id]['org_id'];
    let org_name = orgArr[id]['org_name'];
    let org_country = orgArr[id]['org_country'];
    let org_city = orgArr[id]['org_city'];
    let org_adress = orgArr[id]['org_adress'];
    let org_timezone = orgArr[id]['org_timezone'];
    let org_tel = orgArr[id]['org_tel'];
    let org_fax = orgArr[id]['org_fax'];
    let org_mob = orgArr[id]['org_mob'];
    let org_email = orgArr[id]['org_email'];
    let org_skype = orgArr[id]['org_skype'];
    let org_site = orgArr[id]['org_site'];
    let org_tax_id = orgArr[id]['org_tax_id'];
    let org_logo = orgArr[id]['org_logo'];
    let org_sound = orgArr[id]['org_sound'];
    let org_development = orgArr[id]['org_development'];
    let org_money_points = orgArr[id]['org_money_points'];
    let org_starting_points = orgArr[id]['org_starting_points'];
    let org_money_percent = orgArr[id]['org_money_percent'];
    let org_points_points = orgArr[id]['org_points_points'];
    let org_promo_points_owner = orgArr[id]['org_promo_points_owner'];
    let org_promo_points_scan_owner = orgArr[id]['org_promo_points_scan_owner'];
    let org_promo_points_involved = orgArr[id]['org_promo_points_involved'];
    let org_promo_points_scan_involved = orgArr[id]['org_promo_points_scan_involved'];
    let org_max_points = orgArr[id]['org_max_points'];
    let org_risk_summ = orgArr[id]['org_risk_summ'];
    let org_autoaprove = orgArr[id]['org_autoaprove'];
    let org_appvers = orgArr[id]['org_appvers'];
    let org_appurl = orgArr[id]['org_appurl'];
    let org_log = orgArr[id]['org_log'];
    let org_reg = orgArr[id]['org_reg'];
    let org_del = orgArr[id]['org_del'];

    let queryOrg = "SELECT * FROM organizations WHERE org_id = ?";
    this.database.executeSql(queryOrg, [org_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let orgUpd = "UPDATE organizations SET org_name=?, org_country=?, org_city=?, org_adress=?, org_timezone=?, org_tel=?, org_fax=?, org_mob=?, org_email=?, org_skype=?, org_site=?, org_tax_id=?, org_logo=?, org_sound=?, org_development=?, org_money_points=?, org_starting_points=?, org_money_percent=?, org_points_points=?, org_promo_points_owner=?, org_promo_points_scan_owner=?, org_promo_points_involved=?, org_promo_points_scan_involved=?, org_max_points=?, org_risk_summ=?, org_autoaprove=?, org_appvers=?, org_appurl=?, org_log=?, org_reg=?, org_del=? WHERE org_id=?";
        this.database.executeSql(orgUpd, [org_name, org_country, org_city, org_adress, org_timezone, org_tel, org_fax, org_mob, org_email, org_skype, org_site, org_tax_id, org_logo, org_sound, org_development, org_money_points, org_starting_points, org_money_percent, org_points_points, org_promo_points_owner, org_promo_points_scan_owner, org_promo_points_involved, org_promo_points_scan_involved, org_max_points, org_risk_summ, org_autoaprove, org_appvers, org_appurl, org_log, org_reg, org_del, org_id])
        .then(() => {
          id++;
          if(id < orgArr.length) {
            this.orgArrFunc(id, orgArr);
          }
        })
        .catch(() => {});
      }
      else {
        let orgIns = "INSERT INTO organizations (org_id, org_name, org_country, org_city, org_adress, org_timezone, org_tel, org_fax, org_mob, org_email, org_skype, org_site, org_tax_id, org_logo, org_sound, org_development, org_money_points, org_starting_points, org_money_percent, org_points_points, org_promo_points_owner, org_promo_points_scan_owner, org_promo_points_involved, org_promo_points_scan_involved, org_max_points, org_risk_summ, org_autoaprove, org_appvers, org_appurl, org_log, org_reg, org_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(orgIns, [org_id, org_name, org_country, org_city, org_adress, org_timezone, org_tel, org_fax, org_mob, org_email, org_skype, org_site, org_tax_id, org_logo, org_sound, org_development, org_money_points, org_starting_points, org_money_percent, org_points_points, org_promo_points_owner, org_promo_points_scan_owner, org_promo_points_involved, org_promo_points_scan_involved, org_max_points, org_risk_summ, org_autoaprove, org_appvers, org_appurl, org_log, org_reg, org_del])
        .then(() => {
          id++;
          if(id < orgArr.length) {
            this.orgArrFunc(id, orgArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  orgArrFuncIns(id, orgArr) {
    
    let org_id = orgArr[id]['org_id'];
    let org_name = orgArr[id]['org_name'];
    let org_country = orgArr[id]['org_country'];
    let org_city = orgArr[id]['org_city'];
    let org_adress = orgArr[id]['org_adress'];
    let org_timezone = orgArr[id]['org_timezone'];
    let org_tel = orgArr[id]['org_tel'];
    let org_fax = orgArr[id]['org_fax'];
    let org_mob = orgArr[id]['org_mob'];
    let org_email = orgArr[id]['org_email'];
    let org_skype = orgArr[id]['org_skype'];
    let org_site = orgArr[id]['org_site'];
    let org_tax_id = orgArr[id]['org_tax_id'];
    let org_logo = orgArr[id]['org_logo'];
    let org_sound = orgArr[id]['org_sound'];
    let org_development = orgArr[id]['org_development'];
    let org_money_points = orgArr[id]['org_money_points'];
    let org_starting_points = orgArr[id]['org_starting_points'];
    let org_money_percent = orgArr[id]['org_money_percent'];
    let org_points_points = orgArr[id]['org_points_points'];
    let org_promo_points_owner = orgArr[id]['org_promo_points_owner'];
    let org_promo_points_scan_owner = orgArr[id]['org_promo_points_scan_owner'];
    let org_promo_points_involved = orgArr[id]['org_promo_points_involved'];
    let org_promo_points_scan_involved = orgArr[id]['org_promo_points_scan_involved'];
    let org_max_points = orgArr[id]['org_max_points'];
    let org_risk_summ = orgArr[id]['org_risk_summ'];
    let org_autoaprove = orgArr[id]['org_autoaprove'];
    let org_appvers = orgArr[id]['org_appvers'];
    let org_appurl = orgArr[id]['org_appurl'];
    let org_log = orgArr[id]['org_log'];
    let org_reg = orgArr[id]['org_reg'];
    let org_del = orgArr[id]['org_del'];

    let queryOrg = "SELECT * FROM organizations WHERE org_id = ?";
    this.database.executeSql(queryOrg, [org_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let orgUpd = "UPDATE organizations SET org_name=?, org_country=?, org_city=?, org_adress=?, org_timezone=?, org_tel=?, org_fax=?, org_mob=?, org_email=?, org_skype=?, org_site=?, org_tax_id=?, org_logo=?, org_sound=?, org_development=?, org_money_points=?, org_starting_points=?, org_money_percent=?, org_points_points=?, org_promo_points_owner=?, org_promo_points_scan_owner=?, org_promo_points_involved=?, org_promo_points_scan_involved=?, org_max_points=?, org_risk_summ=?, org_autoaprove=?, org_appvers=?, org_appurl=?, org_log=?, org_reg=?, org_del=? WHERE org_id=?";
        this.database.executeSql(orgUpd, [org_name, org_country, org_city, org_adress, org_timezone, org_tel, org_fax, org_mob, org_email, org_skype, org_site, org_tax_id, org_logo, org_sound, org_development, org_money_points, org_starting_points, org_money_percent, org_points_points, org_promo_points_owner, org_promo_points_scan_owner, org_promo_points_involved, org_promo_points_scan_involved, org_max_points, org_risk_summ, org_autoaprove, org_appvers, org_appurl, org_log, org_reg, org_del, org_id])
        .then(() => {
          id++;
          if(id < orgArr.length) {
            this.orgArrFuncIns(id, orgArr);
          }
        }).catch(() => {});
      }
      else {
        let orgIns = "INSERT INTO organizations (org_id, org_name, org_country, org_city, org_adress, org_timezone, org_tel, org_fax, org_mob, org_email, org_skype, org_site, org_tax_id, org_logo, org_sound, org_development, org_money_points, org_starting_points, org_money_percent, org_points_points, org_promo_points_owner, org_promo_points_scan_owner, org_promo_points_involved, org_promo_points_scan_involved, org_max_points, org_risk_summ, org_autoaprove, org_appvers, org_appurl, org_log, org_reg, org_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(orgIns, [org_id, org_name, org_country, org_city, org_adress, org_timezone, org_tel, org_fax, org_mob, org_email, org_skype, org_site, org_tax_id, org_logo, org_sound, org_development, org_money_points, org_starting_points, org_money_percent, org_points_points, org_promo_points_owner, org_promo_points_scan_owner, org_promo_points_involved, org_promo_points_scan_involved, org_max_points, org_risk_summ, org_autoaprove, org_appvers, org_appurl, org_log, org_reg, org_del])
        .then(() => {
          id++;
          if(id < orgArr.length) {
            this.orgArrFuncIns(id, orgArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  reservArrFunc(id, reservArr) {
    
    let reservation_id = reservArr[id]['reservation_id'];
    let reservation_userid = reservArr[id]['reservation_userid'];
    let reservation_surname = reservArr[id]['reservation_surname'];
    let reservation_name = reservArr[id]['reservation_name'];
    let reservation_middlename = reservArr[id]['reservation_middlename'];
    let reservation_mobile = reservArr[id]['reservation_mobile'];
    let reservation_date = reservArr[id]['reservation_date'];
    let reservation_time = reservArr[id]['reservation_time'];
    let reservation_comment = reservArr[id]['reservation_comment'];
    let reservation_institution = reservArr[id]['reservation_institution'];
    let reservation_when = reservArr[id]['reservation_when'];
    let reservation_del = reservArr[id]['reservation_del'];

    let queryReserv = "SELECT * FROM reservation WHERE reservation_id = ?";
    this.database.executeSql(queryReserv, [reservation_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let chatUpd = "UPDATE chat SET reservation_userid=?, reservation_surname=?, reservation_name=?, reservation_middlename=?, reservation_mobile=?, reservation_date=?, reservation_time=?, reservation_comment=?, reservation_institution=?, reservation_when=?, reservation_del=? WHERE reservation_id=?";
        this.database.executeSql(chatUpd, [reservation_userid, reservation_surname, reservation_name, reservation_middlename, reservation_mobile, reservation_date, reservation_time, reservation_comment, reservation_institution, reservation_when, reservation_del, reservation_id]).then(() => {
          id++;
          if(id < reservArr.length) {
            this.reservArrFunc(id, reservArr);
          }
        })
        .catch(() => {});
      }
      else {
        let reservIns = "INSERT INTO reservation (reservation_id, reservation_userid, reservation_surname, reservation_name, reservation_middlename, reservation_mobile, reservation_date, reservation_time, reservation_comment, reservation_institution, reservation_when, reservation_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(reservIns, [reservation_id, reservation_userid, reservation_surname, reservation_name, reservation_middlename, reservation_mobile, reservation_date, reservation_time, reservation_comment, reservation_institution, reservation_when, reservation_del])
        .then(() => {
          id++;
          if(id < reservArr.length) {
            this.reservArrFunc(id, reservArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  reservArrFuncIns(id, reservArr) {
    
    let reservation_id = reservArr[id]['reservation_id'];
    let reservation_userid = reservArr[id]['reservation_userid'];
    let reservation_surname = reservArr[id]['reservation_surname'];
    let reservation_name = reservArr[id]['reservation_name'];
    let reservation_middlename = reservArr[id]['reservation_middlename'];
    let reservation_mobile = reservArr[id]['reservation_mobile'];
    let reservation_date = reservArr[id]['reservation_date'];
    let reservation_time = reservArr[id]['reservation_time'];
    let reservation_comment = reservArr[id]['reservation_comment'];
    let reservation_institution = reservArr[id]['reservation_institution'];
    let reservation_when = reservArr[id]['reservation_when'];
    let reservation_del = reservArr[id]['reservation_del'];

    let queryReserv = "SELECT * FROM reservation WHERE reservation_id = ?";
    this.database.executeSql(queryReserv, [reservation_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let fifthUpd = "UPDATE fifthgift SET reservation_userid=?, reservation_surname=?, reservation_name=?, reservation_middlename=?, reservation_mobile=?, reservation_date=?, reservation_time=?, reservation_comment=?, reservation_institution=?, reservation_when=?, reservation_del=? WHERE reservation_id=?";
        this.database.executeSql(fifthUpd, [reservation_userid, reservation_surname, reservation_name, reservation_middlename, reservation_mobile, reservation_date, reservation_time, reservation_comment, reservation_institution, reservation_when, reservation_del, reservation_id]).then(() => {
          id++;
          if(id < reservArr.length) {
            this.reservArrFuncIns(id, reservArr);
          }
        })
        .catch(() => {});
      }
      else {
        let reservIns = "INSERT INTO reservation (reservation_id, reservation_userid, reservation_surname, reservation_name, reservation_middlename, reservation_mobile, reservation_date, reservation_time, reservation_comment, reservation_institution, reservation_when, reservation_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(reservIns, [reservation_id, reservation_userid, reservation_surname, reservation_name, reservation_middlename, reservation_mobile, reservation_date, reservation_time, reservation_comment, reservation_institution, reservation_when, reservation_del])
        .then(() => {
          id++;
          if(id < reservArr.length) {
            this.reservArrFuncIns(id, reservArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  fifthArrFunc(id, fifthArr) {
    
    let fifth_id = fifthArr[id]['fifth_id'];
    let fifth_name = fifthArr[id]['fifth_name'];
    let fifth_desc = fifthArr[id]['fifth_desc'];
    let fifth_user = fifthArr[id]['fifth_user'];
    let fifth_menue_id = fifthArr[id]['fifth_menue_id'];
    let fifth_bill = fifthArr[id]['fifth_bill'];
    let fifth_got_spend = fifthArr[id]['fifth_got_spend'];
    let fifth_institution = fifthArr[id]['fifth_institution'];
    let fifth_office = fifthArr[id]['fifth_office'];
    let fifth_when = fifthArr[id]['fifth_when'];
    let fifth_del = fifthArr[id]['fifth_del'];

    let queryFifth = "SELECT * FROM fifthgift WHERE fifth_id = ?";
    this.database.executeSql(queryFifth, [fifth_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let chatUpd = "UPDATE fifthgift SET fifth_name=?, fifth_desc=?, fifth_user=?, fifth_menue_id=?, fifth_bill=?, fifth_got_spend=?, fifth_institution=?, fifth_office=?, fifth_when=?, fifth_del=? WHERE fifth_id=?";
        this.database.executeSql(chatUpd, [fifth_name, fifth_desc, fifth_user, fifth_menue_id, fifth_bill, fifth_got_spend, fifth_institution, fifth_office, fifth_when, fifth_del, fifth_id])
        .then(() => {
          id++;
          if(id < fifthArr.length) {
            this.fifthArrFunc(id, fifthArr);
          }
        })
        .catch(() => {});
      }
      else {
        let fifthIns = "INSERT INTO fifthgift (fifth_id, fifth_name, fifth_desc, fifth_user, fifth_menue_id, fifth_bill, fifth_got_spend, fifth_institution, fifth_office, fifth_when, fifth_del) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(fifthIns, [fifth_id, fifth_name, fifth_desc, fifth_user, fifth_menue_id, fifth_bill, fifth_got_spend, fifth_institution, fifth_office, fifth_when, fifth_del])
        .then(() => {
          id++;
          if(id < fifthArr.length) {
            this.fifthArrFunc(id, fifthArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  fifthArrFuncIns(id, fifthArr) {
    
    let fifth_id = fifthArr[id]['fifth_id'];
    let fifth_name = fifthArr[id]['fifth_name'];
    let fifth_desc = fifthArr[id]['fifth_desc'];
    let fifth_user = fifthArr[id]['fifth_user'];
    let fifth_menue_id = fifthArr[id]['fifth_menue_id'];
    let fifth_bill = fifthArr[id]['fifth_bill'];
    let fifth_got_spend = fifthArr[id]['fifth_got_spend'];
    let fifth_institution = fifthArr[id]['fifth_institution'];
    let fifth_office = fifthArr[id]['fifth_office'];
    let fifth_when = fifthArr[id]['fifth_when'];
    let fifth_del = fifthArr[id]['fifth_del'];

    let queryFifth = "SELECT * FROM fifthgift WHERE fifth_id = ?";
    this.database.executeSql(queryFifth, [fifth_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let fifthUpd = "UPDATE fifthgift SET fifth_name=?, fifth_desc=?, fifth_user=?, fifth_menue_id=?, fifth_bill=?, fifth_got_spend=?, fifth_institution=?, fifth_office=?, fifth_when=?, fifth_del=? WHERE fifth_id=?";
        this.database.executeSql(fifthUpd, [fifth_name, fifth_desc, fifth_user, fifth_menue_id, fifth_bill, fifth_got_spend, fifth_institution, fifth_office, fifth_when, fifth_del, fifth_id])
        .then(() => {
          id++;
          if(id < fifthArr.length) {
            this.fifthArrFuncIns(id, fifthArr);
          }
        })
        .catch(() => {});
      }
      else {
        let fifthIns = "INSERT INTO fifthgift (fifth_id, fifth_name, fifth_desc, fifth_user, fifth_menue_id, fifth_bill, fifth_got_spend, fifth_institution, fifth_office, fifth_when, fifth_del) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(fifthIns, [fifth_id, fifth_name, fifth_desc, fifth_user, fifth_menue_id, fifth_bill, fifth_got_spend, fifth_institution, fifth_office, fifth_when, fifth_del])
        .then(() => {
          id++;
          if(id < fifthArr.length) {
            this.fifthArrFuncIns(id, fifthArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

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

    let queryChat = "SELECT * FROM chat WHERE chat_id = ?";
    this.database.executeSql(queryChat, [chat_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let chatUpd = "UPDATE chat SET chat_read=?, chat_answered=?, chat_when=?, chat_del=? WHERE chat_id=?";
        this.database.executeSql(chatUpd, [chat_read, chat_answered, chat_when, chat_del, chat_id])
        .then(() => {
          id++;
          if(id < chatArr.length) {
            this.chatArrFunc(id, chatArr);
          }
        })
        .catch(() => {});
      }
      else {
        let chatIns = "INSERT INTO chat (chat_id, chat_from, chat_to, chat_name, chat_message, chat_read, chat_institution, chat_answered, chat_when, chat_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(chatIns, [chat_id, chat_from, chat_to, chat_name, chat_message, chat_read, chat_institution, chat_answered, chat_when, chat_del])
        .then(() => {
          id++;
          if(id < chatArr.length) {
            this.chatArrFunc(id, chatArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  chatArrFuncIns(id, chatArr) {
    
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

    let chatIns = "INSERT INTO chat (chat_id, chat_from, chat_to, chat_name, chat_message, chat_read, chat_institution, chat_answered, chat_when, chat_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(chatIns, [chat_id, chat_from, chat_to, chat_name, chat_message, chat_read, chat_institution, chat_answered, chat_when, chat_del]).then(() => {
      id++;
      if(id < chatArr.length) {
        this.chatArrFuncIns(id, chatArr);
      }
    })
    .catch(() => {});

  }

  asksArrFunc(id, asksArr) {
    
    let asks_id = asksArr[id]['asks_id'];
    let asks_name = asksArr[id]['asks_name'];
    let asks_message = asksArr[id]['asks_message'];
    let asks_type = asksArr[id]['asks_type'];
    let asks_chained = asksArr[id]['asks_chained'];
    let asks_active = asksArr[id]['asks_active'];
    let asks_img = asksArr[id]['asks_img'];
    let asks_answ = asksArr[id]['asks_answ'];
    let asks_yes = asksArr[id]['asks_yes'];
    let asks_no = asksArr[id]['asks_no'];
    let asks_institution = asksArr[id]['asks_institution'];
    let asks_del = asksArr[id]['asks_del'];
    let asks_when = asksArr[id]['asks_when'];

    let queryAsks = "SELECT * FROM asks WHERE asks_id = ?";
    this.database.executeSql(queryAsks, [asks_id]).then(suc => {
      if(suc.rows.length == 0) {
        let newsIns = "INSERT INTO asks (asks_id, asks_name, asks_message, asks_type, asks_chained, asks_active, asks_img, asks_answ, asks_yes, asks_no, asks_reply, asks_institution, asks_when, asks_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(newsIns, [asks_id, asks_name, asks_message, asks_type, asks_chained, asks_active, asks_img, asks_answ, asks_yes, asks_no, 0, asks_institution, asks_when, asks_del])
        .then(() => {
          id++;
          if(id < asksArr.length) {
            this.asksArrFunc(id, asksArr);
          }
        })
        .catch(() => {});
      }
      else {
        let asksIns = "UPDATE asks SET asks_name=?, asks_message=?, asks_type=?, asks_chained=?, asks_active=?, asks_img=?, asks_answ=?, asks_yes=?, asks_no=?, asks_institution=?, asks_when=?, asks_del=? WHERE asks_id=?";
        this.database.executeSql(asksIns, [asks_name, asks_message, asks_type, asks_chained, asks_active, asks_img, asks_answ, asks_yes, asks_no, asks_institution, asks_when, asks_del, asks_id])
        .then((ins) => {
          id++;
          if(id < asksArr.length) {
            this.asksArrFunc(id, asksArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }
  
  asksArrFuncIns(id, asksArr) {
    
    let asks_id = asksArr[id]['asks_id'];
    let asks_name = asksArr[id]['asks_name'];
    let asks_message = asksArr[id]['asks_message'];
    let asks_type = asksArr[id]['asks_type'];
    let asks_chained = asksArr[id]['asks_chained'];
    let asks_active = asksArr[id]['asks_active'];
    let asks_img = asksArr[id]['asks_img'];
    let asks_answ = asksArr[id]['asks_answ'];
    let asks_yes = asksArr[id]['asks_yes'];
    let asks_no = asksArr[id]['asks_no'];
    let asks_institution = asksArr[id]['asks_institution'];
    let asks_when = asksArr[id]['asks_when'];
    let asks_del = asksArr[id]['asks_del'];

    let asksIns = "INSERT INTO asks (asks_id, asks_name, asks_message, asks_type, asks_chained, asks_active, asks_img, asks_answ, asks_yes, asks_no, asks_reply, asks_institution, asks_when, asks_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(asksIns, [asks_id, asks_name, asks_message, asks_type, asks_chained, asks_active, asks_img, asks_answ, asks_yes, asks_no, '0', asks_institution, asks_when, asks_del])
    .then(() => {
      id++;
      if(id < asksArr.length) {
        this.asksArrFuncIns(id, asksArr);
      }
    })
    .catch(() => {});

  }

  reviewsArrFunc(id, reviewsArr) {
    
    let reviews_id = reviewsArr[id]['reviews_id'];
    let reviews_from = reviewsArr[id]['reviews_from'];
    let reviews_to = reviewsArr[id]['reviews_to'];
    let reviews_message = reviewsArr[id]['reviews_message'];
    let reviews_pic = reviewsArr[id]['reviews_pic'];
    let reviews_institution = reviewsArr[id]['reviews_institution'];
    let reviews_answered = reviewsArr[id]['reviews_answered'];
    let reviews_opened = reviewsArr[id]['reviews_opened'];
    let reviews_when = reviewsArr[id]['reviews_when'];
    let reviews_del = reviewsArr[id]['reviews_del'];

    let queryReviews = "SELECT * FROM reviews WHERE reviews_id = ?";
    this.database.executeSql(queryReviews, [reviews_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let reviewsUpd = "UPDATE reviews SET reviews_from=?, reviews_to=?, reviews_message=?, reviews_pic=?, reviews_institution=?, reviews_answered=?, reviews_opened=?, reviews_when=?, reviews_del=? WHERE reviews_id=?";
        this.database.executeSql(reviewsUpd, [reviews_from, reviews_to, reviews_message, reviews_pic, reviews_institution, reviews_answered, reviews_opened, reviews_when, reviews_del, reviews_id]).then(() => {
          id++;
          if(id < reviewsArr.length) {
            this.reviewsArrFunc(id, reviewsArr);
          }
        })
        .catch(() => {});
      }
      else {
        let newsIns = "INSERT INTO reviews (reviews_id, reviews_from, reviews_to, reviews_message, reviews_pic, reviews_institution, reviews_answered, reviews_opened, reviews_when, reviews_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(newsIns, [reviews_id, reviews_from, reviews_to, reviews_message, reviews_pic, reviews_institution, reviews_answered, reviews_when, reviews_del])
        .then(() => {
          id++;
          if(id < reviewsArr.length) {
            this.reviewsArrFunc(id, reviewsArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }
  
  reviewsArrFuncIns(id, reviewsArr) {
    
    let reviews_id = reviewsArr[id]['reviews_id'];
    let reviews_from = reviewsArr[id]['reviews_from'];
    let reviews_to = reviewsArr[id]['reviews_to'];
    let reviews_message = reviewsArr[id]['reviews_message'];
    let reviews_pic = reviewsArr[id]['reviews_pic'];
    let reviews_institution = reviewsArr[id]['reviews_institution'];
    let reviews_answered = reviewsArr[id]['reviews_answered'];
    let reviews_opened = reviewsArr[id]['reviews_opened'];
    let reviews_when = reviewsArr[id]['reviews_when'];
    let reviews_del = reviewsArr[id]['reviews_del'];

    let newsIns = "INSERT INTO reviews (reviews_id, reviews_from, reviews_to, reviews_message, reviews_pic, reviews_institution, reviews_answered, reviews_opened, reviews_when, reviews_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(newsIns, [reviews_id, reviews_from, reviews_to, reviews_message, reviews_pic, reviews_institution, reviews_answered, reviews_opened, reviews_when, reviews_del])
    .then(() => {
      id++;
      if(id < reviewsArr.length) {
        this.reviewsArrFuncIns(id, reviewsArr);
      }
    })
    .catch(() => {});

  }

  newsArrFunc(id, newsArr) {
    
    let news_id = newsArr[id]['news_id'];
    let news_state = newsArr[id]['news_state'];
    let news_menue_id = 0;
    let news_cost = 0;
    let news_user = 0;
    let news_used = 0;
    let news_begin = 0;
    let news_end = 0;
    let news_when = newsArr[id]['news_when'];
    let news_del = newsArr[id]['news_del'];
    let news_name = 0;
    let news_message = 0;
    let news_pic = 0;
    let news_institution = 0;

    if(news_state == '1') {
      news_name = newsArr[id]['news_name'];
      news_message = newsArr[id]['news_message'];
      news_pic = newsArr[id]['news_pic'];
      news_institution = newsArr[id]['news_institution'];
      news_menue_id = newsArr[id]['news_menue_id'];
      news_cost = newsArr[id]['news_cost'];
      news_user = newsArr[id]['news_user'];
      news_used = newsArr[id]['news_used'];
      news_begin = newsArr[id]['news_begin'];
      news_end = newsArr[id]['news_end'];
    }

    let queryNews = "SELECT * FROM news WHERE news_id = ?";
    this.database.executeSql(queryNews, [news_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let newsUpd = "UPDATE news SET news_name=?, news_message=?, news_pic=?, news_institution=?, news_state=?, news_menue_id=?, news_cost=?, news_user=?, news_used=?, news_begin=?, news_end=?, news_when=?, news_del=? WHERE news_id=?";
        this.database.executeSql(newsUpd, [news_name, news_message, news_pic, news_institution, news_state, news_menue_id, news_cost, news_user, news_used, news_begin, news_end, news_when, news_del, news_id])
        .then(() => {
          id++;
          if(id < newsArr.length) {
            this.newsArrFunc(id, newsArr);
          }
        })
        .catch(() => {});
      }
      else {
        let newsIns = "INSERT INTO news (news_id, news_name, news_message, news_pic, news_institution, news_state, news_menue_id, news_cost, news_user, news_used, news_begin, news_end, news_when, news_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(newsIns, [news_id, news_name, news_message, news_pic, news_institution, news_state, news_menue_id, news_cost, news_user, news_used, news_begin, news_end, news_when, news_del])
        .then(() => {
          id++;
          if(id < newsArr.length) {
            this.newsArrFunc(id, newsArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  newsArrFuncIns(id, newsArr) {
    
    let news_id = newsArr[id]['news_id'];
    let news_state = newsArr[id]['news_state'];
    let news_menue_id = 0;
    let news_cost = 0;
    let news_user = 0;
    let news_used = 0;
    let news_begin = 0;
    let news_end = 0;
    let news_when = newsArr[id]['news_when'];
    let news_del = newsArr[id]['news_del'];
    let news_name = 0;
    let news_message = 0;
    let news_pic = 0;
    let news_institution = 0;

    if(news_state == '1') {
      news_name = newsArr[id]['news_name'];
      news_message = newsArr[id]['news_message'];
      news_pic = newsArr[id]['news_pic'];
      news_institution = newsArr[id]['news_institution'];
      news_menue_id = newsArr[id]['news_menue_id'];
      news_cost = newsArr[id]['news_cost'];
      news_user = newsArr[id]['news_user'];
      news_used = newsArr[id]['news_used'];
      news_begin = newsArr[id]['news_begin'];
      news_end = newsArr[id]['news_end'];
    }

    let queryNews = "SELECT * FROM news WHERE news_id = ?";
    this.database.executeSql(queryNews, [news_id]).then(suc => {
      if(suc.rows.length > 0) {
        let newsUpd = "UPDATE news SET news_name=?, news_message=?, news_pic=?, news_institution=?, news_state=?, news_menue_id=?, news_cost=?, news_user=?, news_used=?, news_begin=?, news_end=?, news_when=?, news_del=? WHERE news_id=?";
        this.database.executeSql(newsUpd, [news_name, news_message, news_pic, news_institution, news_state, news_menue_id, news_cost, news_user, news_used, news_begin, news_end, news_when, news_del, news_id])
        .then(() => {
          id++;
          if(id < newsArr.length) {
            this.newsArrFuncIns(id, newsArr);
          }
        })
        .catch(() => {});
      }
      else {
        let newsIns = "INSERT INTO news (news_id, news_name, news_message, news_pic, news_institution, news_state, news_menue_id, news_cost, news_user, news_used, news_begin, news_end, news_when, news_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(newsIns, [news_id, news_name, news_message, news_pic, news_institution, news_state, news_menue_id, news_cost, news_user, news_used, news_begin, news_end, news_when, news_del])
        .then(() => {
          id++;
          if(id < newsArr.length) {
            this.newsArrFuncIns(id, newsArr);
          }
        })
        .catch(() => {});
      }
    }).catch(() => {});

  }

  ingrArrFunc(id, ingrArr) {
    
    let ingr_id = ingrArr[id]['ingr_id'];
    let ingr_xid = 0;
    let ingr_when = ingrArr[id]['ingr_when'];
    let ingr_del = ingrArr[id]['ingr_del'];
    let ingr_name = 0;
    let ingr_desc = 0;
    let ingr_cat = 0;
    let ingr_code = 0;
    let ingr_pic = 0;
    let ingr_size = 0;
    let ingr_cost = 0;
    let ingr_institution = 0;

    if(ingr_when != '1') {
      ingr_xid = ingrArr[id]['ingr_xid'];
      ingr_name = ingrArr[id]['ingr_name'];
      ingr_desc = ingrArr[id]['ingr_desc'];
      ingr_cat = ingrArr[id]['ingr_cat'];
      ingr_code = ingrArr[id]['ingr_code'];
      ingr_pic = ingrArr[id]['ingr_pic'];
      ingr_size = ingrArr[id]['ingr_size'];
      ingr_cost = ingrArr[id]['ingr_cost'];
      ingr_institution = ingrArr[id]['ingr_institution'];
    }

    let queryIngrs = "SELECT * FROM ingredients WHERE ingr_id = ?";
    this.database.executeSql(queryIngrs, [ingr_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let menueUpd = "UPDATE ingredients SET ingr_xid=?, ingr_name=?, ingr_desc=?, ingr_cat=?, ingr_code=?, ingr_pic=?, ingr_size=?, ingr_cost=?, ingr_institution=?, ingr_when=?, ingr_del=? WHERE ingr_id=?";
        this.database.executeSql(menueUpd, [ingr_xid, ingr_name, ingr_desc, ingr_cat, ingr_code, ingr_pic, ingr_size, ingr_cost, ingr_institution, ingr_when, ingr_del, ingr_id])
        .then(() => {
          id++;
          if(id < ingrArr.length) {
            this.ingrArrFunc(id, ingrArr);
          }
        })
        .catch(() => {});
      }
      else {
        let ingrsIns = "INSERT INTO ingredients (ingr_id, ingr_xid, ingr_name, ingr_desc, ingr_cat, ingr_code, ingr_pic, ingr_size, ingr_cost, ingr_institution, ingr_when, ingr_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(ingrsIns, [ingr_id, ingr_xid, ingr_name, ingr_desc, ingr_cat, ingr_code, ingr_pic, ingr_size, ingr_cost, ingr_institution, ingr_when, ingr_del])
        .then(() => {
          id++;
          if(id < ingrArr.length) {
            this.ingrArrFunc(id, ingrArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  ingrArrFuncIns(id, ingrArr) {
    
    let ingr_id = ingrArr[id]['ingr_id'];
    let ingr_xid = ingrArr[id]['ingr_xid'];
    let ingr_name = ingrArr[id]['ingr_name'];
    let ingr_desc = ingrArr[id]['ingr_desc'];
    let ingr_cat = ingrArr[id]['ingr_cat'];
    let ingr_code = ingrArr[id]['ingr_code'];
    let ingr_pic = ingrArr[id]['ingr_pic'];
    let ingr_size = ingrArr[id]['ingr_size'];
    let ingr_cost = ingrArr[id]['ingr_cost'];
    let ingr_institution = ingrArr[id]['ingr_institution'];
    let ingr_when = ingrArr[id]['ingr_when'];
    let ingr_del = ingrArr[id]['ingr_del'];

    let ingrsIns = "INSERT INTO ingredients (ingr_id, ingr_xid, ingr_name, ingr_desc, ingr_cat, ingr_code, ingr_pic, ingr_size, ingr_cost, ingr_institution, ingr_when, ingr_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(ingrsIns, [ingr_id, ingr_xid, ingr_name, ingr_desc, ingr_cat, ingr_code, ingr_pic, ingr_size, ingr_cost, ingr_institution, ingr_when, ingr_del])
    .then(() => {
      id++;
      if(id < ingrArr.length) {
        this.ingrArrFuncIns(id, ingrArr);
      }
    })
    .catch(() => {});

  }

  giftsArrFunc(id, giftsArr) {
    
    let gifts_id = giftsArr[id]['gifts_id'];
    let gifts_name = giftsArr[id]['gifts_name'];
    let gifts_desc = giftsArr[id]['gifts_desc'];
    let gifts_points = giftsArr[id]['gifts_points'];
    let gifts_pic = giftsArr[id]['gifts_pic'];
    let gifts_icon = giftsArr[id]['gifts_icon'];
    let gifts_institution = giftsArr[id]['gifts_institution'];
    let gifts_when = giftsArr[id]['gifts_when'];
    let gifts_del = giftsArr[id]['gifts_del'];

    let queryGifts = "SELECT * FROM gifts WHERE gifts_id = ?";
    this.database.executeSql(queryGifts, [gifts_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let giftsUpd = "UPDATE gifts SET gifts_name=?, gifts_desc=?, gifts_points=?, gifts_pic=?, gifts_icon=?, gifts_institution=?, gifts_when=?, gifts_del=? WHERE gifts_id=?";
        this.database.executeSql(giftsUpd, [gifts_name, gifts_desc, gifts_points, gifts_pic, gifts_icon, gifts_institution, gifts_when, gifts_del, gifts_id])
        .then(() => {
          id++;
          if(id < giftsArr.length) {
            this.giftsArrFunc(id, giftsArr);
          }
        })
        .catch(() => {});
      }
      else {
        let giftsIns = "INSERT INTO gifts (gifts_id, gifts_name, gifts_desc, gifts_points, gifts_pic, gifts_icon, gifts_institution, gifts_when, gifts_del) VALUES (?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(giftsIns, [gifts_id, gifts_name, gifts_desc, gifts_points, gifts_pic, gifts_icon, gifts_institution, gifts_when, gifts_del])
        .then(() => {
          id++;
          if(id < giftsArr.length) {
            this.giftsArrFunc(id, giftsArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  giftsArrFuncIns(id, giftsArr) {
    
    let gifts_id = giftsArr[id]['gifts_id'];
    let gifts_name = giftsArr[id]['gifts_name'];
    let gifts_desc = giftsArr[id]['gifts_desc'];
    let gifts_points = giftsArr[id]['gifts_points'];
    let gifts_pic = giftsArr[id]['gifts_pic'];
    let gifts_icon = giftsArr[id]['gifts_icon'];
    let gifts_institution = giftsArr[id]['gifts_institution'];
    let gifts_when = giftsArr[id]['gifts_when'];
    let gifts_del = giftsArr[id]['gifts_del'];

    let giftsIns = "INSERT INTO gifts (gifts_id, gifts_name, gifts_desc, gifts_points, gifts_pic, gifts_icon, gifts_institution, gifts_when, gifts_del) VALUES (?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(giftsIns, [gifts_id, gifts_name, gifts_desc, gifts_points, gifts_pic, gifts_icon, gifts_institution, gifts_when, gifts_del]).then(() => {
      id++;
      if(id < giftsArr.length) {
        this.giftsArrFuncIns(id, giftsArr);
      }
    }).catch(() => {});

  }

  catArrFunc(id, catArr) {
    let cat_id = catArr[id]['cat_id'];
    let cat_xid = 0;
    let cat_when = catArr[id]['cat_when'];
    let cat_del = catArr[id]['cat_del'];
    let cat_name = 0;
    let cat_desc = 0;
    let cat_pic = 0;
    let cat_ingr = 0;
    let cat_order = 0;
    let cat_institution = 0;

    if(cat_when != '1') {
      cat_xid = catArr[id]['cat_xid'];
      cat_name = catArr[id]['cat_name'];
      cat_desc = catArr[id]['cat_desc'];
      cat_pic = catArr[id]['cat_pic'];
      cat_ingr = catArr[id]['cat_ingr'];
      cat_order = catArr[id]['cat_order'];
      cat_institution = catArr[id]['cat_institution'];
    }

    let queryCats = "SELECT * FROM categories WHERE cat_id = ?";
    this.database.executeSql(queryCats, [cat_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let catsUpd = "UPDATE categories SET cat_xid=?, cat_name=?, cat_desc=?, cat_pic=?, cat_ingr=?, cat_order=?, cat_institution=?, cat_when=?, cat_del=? WHERE cat_id=?";
        this.database.executeSql(catsUpd, [cat_xid, cat_name, cat_desc, cat_pic, cat_ingr, cat_order, cat_institution, cat_when, cat_del, cat_id])
        .then(() => {
          id++;
          if(id < catArr.length) {
            this.catArrFunc(id, catArr);
          }
        })
        .catch(() => {});
      }
      else {
        let catsIns = "INSERT INTO categories (cat_id, cat_xid, cat_name, cat_desc, cat_pic, cat_ingr, cat_order, cat_institution, cat_when, cat_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(catsIns, [cat_id, cat_xid, cat_name, cat_desc, cat_pic, cat_ingr, cat_order, cat_institution, cat_when, cat_del])
        .then(() => {
          id++;
          if(id < catArr.length) {
            this.catArrFunc(id, catArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});
  }

  catArrFuncIns(id, catArr) {
    
    let cat_id = catArr[id]['cat_id'];
    let cat_xid = catArr[id]['cat_xid'];
    let cat_name = catArr[id]['cat_name'];
    let cat_desc = catArr[id]['cat_desc'];
    let cat_pic = catArr[id]['cat_pic'];
    let cat_ingr = catArr[id]['cat_ingr'];
    let cat_order = catArr[id]['cat_order'];
    let cat_institution = catArr[id]['cat_institution'];
    let cat_when = catArr[id]['cat_when'];
    let cat_del = catArr[id]['cat_del'];

    let catsIns = "INSERT INTO categories (cat_id, cat_xid, cat_name, cat_desc, cat_pic, cat_ingr, cat_order, cat_institution, cat_when, cat_del) VALUES (?,?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(catsIns, [cat_id, cat_xid, cat_name, cat_desc, cat_pic, cat_ingr, cat_order, cat_institution, cat_when, cat_del]).then(() => {
      id++;
      if(id < catArr.length) {
        this.catArrFuncIns(id, catArr);
      }
    }).catch(() => {});

  }

  menueArrFunc(id, menueArr) {
    
    let menue_id = menueArr[id]['menue_id'];
    let menue_xid = 0;
    let menue_cat_xid = 0;
    let menue_when = menueArr[id]['menue_when'];
    let menue_del = menueArr[id]['menue_del'];
    let menue_cat = 0;
    let menue_name = 0;
    let menue_desc = 0;
    let menue_size = 0;
    let menue_cost = 0;
    let menue_costs = 0;
    let menue_ingr = 0;
    let menue_addition = 0;
    let menue_addition_auto = 0;
    let menue_package = 0;
    let menue_weight = 0;
    let menue_interval = 0;
    let menue_discount = 0;
    let menue_action = 0;
    let menue_code = 0;
    let menue_pic = 0;
    let menue_icon = 0;
    let menue_institution = 0;

    if(menue_when != '1') {
      menue_xid = menueArr[id]['menue_xid'];
      menue_cat_xid = menueArr[id]['menue_cat_xid'];
      menue_cat = menueArr[id]['menue_cat'];
      menue_name = menueArr[id]['menue_name'];
      menue_desc = menueArr[id]['menue_desc'];
      menue_size = menueArr[id]['menue_size'];
      menue_cost = menueArr[id]['menue_cost'];
      menue_costs = menueArr[id]['menue_costs'];
      menue_ingr = menueArr[id]['menue_ingr'];
      menue_addition = menueArr[id]['menue_addition'];
      menue_addition_auto = menueArr[id]['menue_addition_auto'];
      menue_package = menueArr[id]['menue_package'];
      menue_weight = menueArr[id]['menue_weight'];
      menue_discount = menueArr[id]['menue_discount'];
      menue_action = menueArr[id]['menue_action'];
      menue_code = menueArr[id]['menue_code'];
      menue_interval = menueArr[id]['menue_interval'];
      menue_pic = menueArr[id]['menue_pic'];
      menue_icon = menueArr[id]['menue_icon'];
      menue_institution = menueArr[id]['menue_institution'];
    }

    let queryMenue = "SELECT * FROM menue WHERE menue_id = ?";
    this.database.executeSql(queryMenue, [menue_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let menueUpd = "UPDATE menue SET menue_xid=?, menue_cat_xid=?, menue_cat=?, menue_name=?, menue_desc=?, menue_size=?, menue_cost=?, menue_costs=?, menue_ingr=?, menue_addition=?, menue_addition_auto=?, menue_package=?, menue_weight=?, menue_discount=?, menue_action=?, menue_code=?, menue_interval=?, menue_pic=?, menue_icon=?, menue_institution=?, menue_when=?, menue_del=? WHERE menue_id=?";
        this.database.executeSql(menueUpd, [menue_xid, menue_cat_xid, menue_cat, menue_name, menue_desc, menue_size, menue_cost, menue_costs, menue_ingr, menue_addition, menue_addition_auto, menue_package, menue_weight, menue_discount, menue_action, menue_code, menue_interval, menue_pic, menue_icon, menue_institution, menue_when, menue_del, menue_id])
        .then(() => {
          id++;
          if(id < menueArr.length) {
            this.menueArrFunc(id, menueArr);
          }
        })
        .catch(() => {});
      }
      else {
        let menueIns = "INSERT INTO menue (menue_id, menue_xid, menue_cat_xid, menue_cat, menue_name, menue_desc, menue_size, menue_cost, menue_costs, menue_ingr, menue_addition, menue_addition_auto, menue_package, menue_weight, menue_discount, menue_action, menue_code, menue_interval, menue_pic, menue_icon, menue_institution, menue_when, menue_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(menueIns, [menue_id, menue_xid, menue_cat_xid, menue_cat, menue_name, menue_desc, menue_size, menue_cost, menue_costs, menue_ingr, menue_addition, menue_addition_auto, menue_package, menue_weight, menue_discount, menue_action, menue_code, menue_interval, menue_pic, menue_icon, menue_institution, menue_when, menue_del])
        .then(() => {
          id++;
          if(id < menueArr.length) {
            this.menueArrFunc(id, menueArr);
          }
        })
        .catch(() => {});
      }
    })
    .catch(() => {});

  }

  menueArrFuncIns(id, menueArr) {
    
    let menue_id = menueArr[id]['menue_id'];
    let menue_xid = menueArr[id]['menue_xid'];
    let menue_cat_xid = menueArr[id]['menue_cat_xid'];
    let menue_cat = menueArr[id]['menue_cat'];
    let menue_name = menueArr[id]['menue_name'];
    let menue_desc = menueArr[id]['menue_desc'];
    let menue_size = menueArr[id]['menue_size'];
    let menue_cost = menueArr[id]['menue_cost'];
    let menue_costs = menueArr[id]['menue_costs'];
    let menue_ingr = menueArr[id]['menue_ingr'];
    let menue_addition = menueArr[id]['menue_addition'];
    let menue_addition_auto = menueArr[id]['menue_addition_auto'];
    let menue_package = menueArr[id]['menue_package'];
    let menue_weight = menueArr[id]['menue_weight'];
    let menue_interval = menueArr[id]['menue_interval'];
    let menue_discount = menueArr[id]['menue_discount'];
    let menue_action = menueArr[id]['menue_action'];
    let menue_code = menueArr[id]['menue_code'];
    let menue_pic = menueArr[id]['menue_pic'];
    let menue_icon = menueArr[id]['menue_icon'];
    let menue_institution = menueArr[id]['menue_institution'];
    let menue_when = menueArr[id]['menue_when'];
    let menue_del = menueArr[id]['menue_del'];

    let menueIns = "INSERT INTO menue (menue_id, menue_xid, menue_cat_xid, menue_cat, menue_name, menue_desc, menue_size, menue_cost, menue_costs, menue_ingr, menue_addition, menue_addition_auto, menue_package, menue_weight, menue_interval, menue_discount, menue_action, menue_code, menue_pic, menue_icon, menue_institution, menue_when, menue_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(menueIns, [menue_id, menue_xid, menue_cat_xid, menue_cat, menue_name, menue_desc, menue_size, menue_cost, menue_costs, menue_ingr, menue_addition,menue_addition_auto, menue_package, menue_weight, menue_interval, menue_discount, menue_action, menue_code, menue_pic, menue_icon, menue_institution, menue_when, menue_del]).then(() => {
      id++;
      if(id < menueArr.length) {
        this.menueArrFuncIns(id, menueArr);
      }
    }).catch(() => {});

  }

  goodsArrFunc(id, goodsArr) {
    let goods_id = goodsArr[id]['goods_id'];
    let goods_when = goodsArr[id]['goods_when'];
    let goods_del = goodsArr[id]['goods_del'];
    let goods_name = 0;
    let goods_desc = 0;
    let goods_pic = 0;
    let goods_type = 0;
    let goods_institution = 0;

    if(goods_when != '1') {
      goods_name = goodsArr[id]['goods_name'];
      goods_desc = goodsArr[id]['goods_desc'];
      goods_pic = goodsArr[id]['goods_pic'];
      goods_type = goodsArr[id]['goods_type'];
      goods_institution = goodsArr[id]['goods_institution'];
    }

    let queryGoods = "SELECT * FROM goods WHERE goods_id = ?";
    this.database.executeSql(queryGoods, [goods_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let goodsUpd = "UPDATE goods SET goods_name=?, goods_desc=?, goods_pic=?, goods_type=?, goods_institution=?, goods_when=?, goods_del=? WHERE goods_id=?";
        this.database.executeSql(goodsUpd, [goods_name, goods_desc, goods_pic, goods_type, goods_institution, goods_when, goods_del, goods_id])
        .then(() => {
          id++;
          if(id < goodsArr.length) {
            this.goodsArrFunc(id, goodsArr);
          }
        })
        .catch(() => {});
      }
      else {
        let goodsIns = "INSERT INTO goods (goods_id, goods_name, goods_desc, goods_pic, goods_type, goods_institution, goods_when, goods_del) VALUES (?,?,?,?,?,?,?,?)";
        this.database.executeSql(goodsIns, [goods_id, goods_name, goods_desc, goods_pic, goods_type, goods_institution, goods_when, goods_del]).then(() => {
          id++;
          if(id < goodsArr.length) {
            this.goodsArrFunc(id, goodsArr);
          }
        })
        .catch(() => {});
      }
    }).catch(() => {});
  }

  goodsArrFuncIns(id, goodsArr) {
    
    let goods_id = goodsArr[id]['goods_id'];
    let goods_when = goodsArr[id]['goods_when'];
    let goods_name = goodsArr[id]['goods_name'];
    let goods_desc = goodsArr[id]['goods_desc'];
    let goods_pic = goodsArr[id]['goods_pic'];
    let goods_type = goodsArr[id]['goods_type'];
    let goods_institution = goodsArr[id]['goods_institution'];
    let goods_del = goodsArr[id]['goods_del'];

    let goodsIns = "INSERT INTO goods (goods_id, goods_name, goods_desc, goods_pic, goods_type, goods_institution, goods_when, goods_del) VALUES (?,?,?,?,?,?,?,?)";
    this.database.executeSql(goodsIns, [goods_id, goods_name, goods_desc, goods_pic, goods_type, goods_institution, goods_when, goods_del]).then(() => {
      id++;
      if(id < goodsArr.length) {
        this.goodsArrFuncIns(id, goodsArr);
      }
    })
    .catch(() => {});

  }

  pointsArrFunc(id, pointsArr) {
    
    let points_id = pointsArr[id]['points_id'];
    let points_user = pointsArr[id]['points_user'];
    let points_bill = pointsArr[id]['points_bill'];
    let points_discount = pointsArr[id]['points_discount'];
    let points_points = pointsArr[id]['points_points'];
    let points_got_spend = pointsArr[id]['points_got_spend'];
    let points_waiter = pointsArr[id]['points_waiter'];
    let points_institution = pointsArr[id]['points_institution'];
    let points_office = pointsArr[id]['points_office'];
    let points_status = pointsArr[id]['points_status'];
    let points_comment = pointsArr[id]['points_comment'];
    let points_proofed = pointsArr[id]['points_proofed'];
    let points_gift = pointsArr[id]['points_gift'];
    let points_check = pointsArr[id]['points_check'];
    let points_waitertime = pointsArr[id]['points_waitertime'];
    let points_usertime = pointsArr[id]['points_usertime'];
    let points_when = pointsArr[id]['points_when'];
    let points_time = pointsArr[id]['points_time'];
    let points_del = pointsArr[id]['points_del'];

    let queryPoints = "SELECT * FROM points WHERE points_id = ?";
    this.database.executeSql(queryPoints, [points_id])
    .then(suc => {
      if(suc.rows.length > 0) {
        let pointsUpd = "UPDATE points SET points_status=?, points_proofed=?, points_when=?, points_del=? WHERE points_id=?";
        this.database.executeSql(pointsUpd, [points_status, points_proofed, points_when, points_del, points_id])
        .then(() => {
          id++;
          if(id < pointsArr.length) {
            this.pointsArrFunc(id, pointsArr);
          }
        })
        .catch(() => {});
      }
      else {
        let pointsIns = "INSERT INTO points (points_id, points_user, points_bill, points_discount, points_points, points_got_spend, points_waiter, points_institution, points_office, points_status, points_comment, points_proofed, points_gift, points_check, points_waitertime, points_usertime, points_when, points_time, points_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(pointsIns, [points_id, points_user, points_bill, points_discount, points_points, points_got_spend, points_waiter, points_institution, points_office, points_status, points_comment, points_proofed, points_gift, points_check, points_waitertime, points_usertime, points_when, points_time, points_del])
        .then(() => {
          id++;
          if(id < pointsArr.length) {
            this.pointsArrFunc(id, pointsArr);
          }
        })
        .catch(() => {});
      }
    }).catch(() => {});

  }

  pointsArrFuncIns(id, pointsArr) {
    
    let points_id = pointsArr[id]['points_id'];
    let points_user = pointsArr[id]['points_user'];
    let points_bill = pointsArr[id]['points_bill'];
    let points_discount = pointsArr[id]['points_discount'];
    let points_points = pointsArr[id]['points_points'];
    let points_got_spend = pointsArr[id]['points_got_spend'];
    let points_waiter = pointsArr[id]['points_waiter'];
    let points_institution = pointsArr[id]['points_institution'];
    let points_office = pointsArr[id]['points_office'];
    let points_status = pointsArr[id]['points_status'];
    let points_comment = pointsArr[id]['points_comment'];
    let points_proofed = pointsArr[id]['points_proofed'];
    let points_gift = pointsArr[id]['points_gift'];
    let points_check = pointsArr[id]['points_check'];
    let points_waitertime = pointsArr[id]['points_waitertime'];
    let points_usertime = pointsArr[id]['points_usertime'];
    let points_when = pointsArr[id]['points_when'];
    let points_time = pointsArr[id]['points_time'];
    let points_del = pointsArr[id]['points_del'];

    let pointsIns = "INSERT INTO points (points_id, points_user, points_bill, points_discount, points_points, points_got_spend, points_waiter, points_institution, points_office, points_status, points_comment, points_proofed, points_gift, points_check, points_waitertime, points_usertime, points_when, points_time, points_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    this.database.executeSql(pointsIns, [points_id, points_user, points_bill, points_discount, points_points, points_got_spend, points_waiter, points_institution, points_office, points_status, points_comment, points_proofed, points_gift, points_check, points_waitertime, points_usertime, points_when, points_time, points_del]).then(() => {
      id++;
      if(id < pointsArr.length) {
        this.pointsArrFuncIns(id, pointsArr);
      }
    })
    .catch(() => {});

  }


  orderSentRecord(gotdata) {
    
    let order_id = gotdata['order_id'];
    let order_user = gotdata['order_user'];
    let order_name = gotdata['order_name'];
    let order_desc = gotdata['order_desc'];
    let order_worker = gotdata['order_worker'];
    let order_institution = gotdata['order_institution'];
    let order_office = gotdata['order_office'];
    let order_bill = gotdata['order_bill'];
    let order_goods = gotdata['order_goods'];
    let order_cats = gotdata['order_cats'];
    let order_order = gotdata['order_order'];
    let order_status = gotdata['order_status'];
    let order_start = gotdata['order_start'];
    let order_end = gotdata['order_end'];
    let order_allday = gotdata['order_allday'];
    let order_mobile = gotdata['order_mobile'];
    let order_when = gotdata['order_when'];
    let order_del = gotdata['order_del'];

    let queryOrdering = "SELECT * FROM ordering WHERE order_id = ?";
    this.database.executeSql(queryOrdering, [order_id])
    .then(suc => {
      if(suc.rows.length > 0) {

        let orderingUpd = "UPDATE ordering SET order_user=?, order_name=?, order_desc=?, order_worker=?, order_institution=?, order_office=?, order_bill=?, order_goods=?, order_cats=?, order_order=?, order_status=?, order_start=?, order_end=?, order_allday=?, order_mobile=?, order_when=?, order_del=? WHERE order_id=?";
        this.database.executeSql(orderingUpd, [order_user, order_name, order_desc, order_worker, order_institution, order_office, order_bill, order_goods, order_cats, order_order, order_status, order_start, order_end, order_allday, order_mobile, order_when, order_del, order_id]).then(suc2 => {}).catch(e => console.log(e));

      }
      else {

        let orderIns = "INSERT INTO ordering (order_id, order_user, order_name, order_desc, order_worker, order_institution, order_office, order_bill, order_goods, order_cats, order_order, order_status, order_start, order_end, order_allday, order_mobile, order_when, order_del) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        this.database.executeSql(orderIns, [order_id, order_user, order_name, order_desc, order_worker, order_institution, order_office, order_bill, order_goods, order_cats, order_order, order_status, order_start, order_end, order_allday, order_mobile, order_when, order_del]).then(suc2 => {}).catch(e => console.log(e));

      }
    })
    .catch(e => console.log(e));

  };

  
  crDir() {
    // CHECK AND CREATE DIRECTION
    this.file.checkDir(this.file.documentsDirectory, this.instdir).then(() => {}).catch(() => {
      this.file.createDir(this.file.documentsDirectory, this.instdir, false).then(() => {}).catch(() => {});
    });
    // CHECK AND CREATE DIRECTION
    this.file.checkDir(this.file.dataDirectory, this.instdir).then(() => {}).catch(() => {
      this.file.createDir(this.file.dataDirectory, this.instdir, false).then(() => {}).catch(() => {});
    });
  }

  regPush() {
    // to check if we have permission
    this.push.hasPermission()
    .then((res: any) => {

      if (res.isEnabled) {
        // console.log('We have permission to send push notifications');
      } else {
        // console.log('We do not have permission to send push notifications');
      }

    });
    let push_options: PushOptions = {
      android: {
        sound: true
      },
      ios: {
        clearBadge: true,
        alert: true,
        badge: true,
        sound: true
      },
      windows: {},
      browser: {
          // pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };
   
   let pushObject: PushObject = this.push.init(push_options);
   
   pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
   
   pushObject.on('registration').subscribe((registration: any) => {

    let gcmstr = {
      device: this.model,
      device_id: this.uuid,
      device_serial: this.serial,
      device_version: this.version,
      device_os: this.platform,
      inst_id: this.institution,
      gcm: registration.registrationId,
      newusr: 'gcmreg'
    }
    this.httpRequest(JSON.stringify(gcmstr))
    .subscribe(pushsuc => {
      // console.log('PUSH SUCCESS: '+JSON.stringify(pushsuc));
    }, error => {
      // console.log('PUSH ERROR: '+JSON.stringify(error));
    });

   });
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  ifNotExists(tablename, columnname, columntype, defaultvalue) {
    // FOR OLDER VERSION OF APP - ADD SOME NEW MENUE COLUMNS
    let queryAlter = "SELECT * FROM "+tablename+" WHERE "+columnname+"=?";
    this.database.executeSql(queryAlter, [0])
    .then(() => {})
    .catch(() => {

      let queryAdd = "ALTER TABLE "+tablename+" ADD COLUMN "+columnname+" "+columntype;
      this.database.executeSql(queryAdd, [])
      .then(() => {

        let queryUpd = "UPDATE "+tablename+" SET "+columnname+"="+defaultvalue;
        this.database.executeSql(queryUpd, [])
        .then(() => {})
        .catch(() => {});

      })
      .catch(() => {});

    });

  }

  validateEmail(email) {
    let mailproof = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return mailproof.test(email);
  }

  makeid() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  crnewdate(dat, adday) {
    return new Date(dat.getFullYear(),dat.getMonth(),dat.getDate()+adday,0,0,0,0);
  }

  httpRequest(json) {
    // let headers = new Headers({
		// 	'Content-Type': 'application/x-www-form-urlencoded'
		// });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.generalscript, json, options)
        .timeout(1000)
        .do(this.logResponse)
        .map(this.extractData)
        .catch(this.handleError)
  }
  
  private logResponse(res: Response) {
      // console.log(JSON.stringify(res));
  }
  
  private extractData(res: Response) {
      return res.json();
  }
  
  private handleError(res: Response | any) {
      return Observable.throw(res.json().error || 'Fail to connect to the server');
  }


  
  updateProfile(val) {

    for(let key in val) {
      if(val.hasOwnProperty(key)) {
        if(val[key] == null || val[key] == '') {
          val[key] = 0;
        }
      }
    }
      
    let user_real_id = val.user_real_id;
    let user_name = val.user_name;
    let user_surname = val.user_surname;
    let user_middlename = val.user_middlename;
    let user_email = val.user_email;
    let user_email_confirm = val.user_email_confirm;
    let user_pwd = val.user_pwd;
    let user_tel = val.user_tel;
    let user_mob_confirm = val.user_mob_confirm;
    let user_mob = val.user_mob;
    let user_info = val.user_info;
    let user_work_pos = val.user_work_pos;
    let user_menue_exe = val.user_menue_exe;
    let user_institution = val.user_institution;
    let user_office = val.user_office;
    let user_pic = val.user_pic;
    let user_gender = val.user_gender;
    let user_birthday = val.user_birthday;
    let user_country = val.user_country;
    let user_region = val.user_region;
    let user_city = val.user_city;
    let user_adress = val.user_adress;
    let user_install_where = val.user_install_where;
    let user_log_key = val.user_log_key;
    let user_gcm = val.user_gcm;
    let user_device = val.user_device;
    let user_device_id = val.user_device_id;
    let user_device_serial = val.user_device_serial;
    let user_device_version = val.user_device_version;
    let user_device_os = val.user_device_os;
    let user_discount = val.user_discount;
    let user_promo = val.user_promo;
    let user_conf_req = val.user_conf_req;
    let user_log = val.user_log;
    let user_upd = val.user_upd;
    let user_reg = val.user_reg;
    let user_del = val.user_del;

    let corrtime: any = this.timezoneAdd(val.user_log);
    this.serverdate = new Date(corrtime*1000);
    this.serverdateraw = val.user_log;
    setTimeout(() => {
      // every day 2 weeks
      for(let i=0;i<14;i++) {
        this.dates.push({dat: this.crnewdate(this.serverdate, i)});
      }
    }, 200);

    let queryUsrLog = "SELECT * FROM users WHERE user_id=? LIMIT 1";
    this.database.executeSql(queryUsrLog, [1])
    .then(suc => {
      if(suc.rows.length > 0) {
        
        let queryUsrDataUpd = "UPDATE users SET user_real_id=?, user_name=?, user_surname=?, user_middlename=?, user_email=?, user_email_confirm=?, user_pwd=?, user_tel=?, user_mob_confirm=?, user_mob=?, user_info=?, user_work_pos=?, user_menue_exe=?, user_institution=?, user_office=?, user_pic=?, user_gender=?, user_birthday=?, user_country=?, user_region=?, user_city=?, user_adress=?, user_install_where=?, user_log_key=?, user_gcm=?, user_device=?, user_device_id=?, user_device_serial=?, user_device_version=?, user_device_os=?, user_discount=?, user_promo=?, user_conf_req=?, user_log=?, user_upd=?, user_reg=?, user_del=? WHERE user_id=?";
        this.database.executeSql(queryUsrDataUpd, [user_real_id, user_name, user_surname, user_middlename, user_email, user_email_confirm, user_pwd, user_tel, user_mob_confirm, user_mob, user_info, user_work_pos, user_menue_exe, user_institution, user_office, user_pic, user_gender, user_birthday, user_country, user_region, user_city, user_adress, user_install_where, user_log_key, user_gcm, user_device, user_device_id, user_device_serial, user_device_version, user_device_os, user_discount, user_promo, user_conf_req, user_log, user_upd, user_reg, user_del, 1])
        .then(suc => {})
        .catch(e => console.log('ERROR UPD PROF '+JSON.stringify(e)));

      }
    })
    .catch(() => {});

  }

  promoConfirm(data) {
    let promoOK = parseInt(data[0].promoOK);
    if(promoOK == 2) {
      promoOK = 1;
    }
    let updateMob = "UPDATE users SET user_promo=? WHERE user_id=?";
    this.database.executeSql(updateMob, [promoOK, 1])
    .then(suc => {})
    .catch(e => console.log(e));
  }

  smsConfirmOk(data) {
    let updateMob = "UPDATE users SET user_mob_confirm=?, user_upd=? WHERE user_id = ?";
    this.database.executeSql(updateMob, [1, data[0].when, 1]).then(suc => {

      if(data[0].oldUsr) {
        
        let oldUsr = [data[0].oldUsr];

        if(typeof data[0].oldUsr !== 'undefined' && data[0].oldUsr !== null && data[0].oldUsr.length > 0) {

          // USER DISCOUNT
          if(oldUsr[0].usrData.user_discount > '0') {

            let usrdiscount = oldUsr[0].usrData.user_discount;

            let queryUsrDiscount = "SELECT * FROM users WHERE user_id=? AND user_discount=? AND user_del='0' LIMIT 1";
            this.database.executeSql(queryUsrDiscount, [1, usrdiscount]).then(suc2 => {
              if(suc2.rows.length == 0) {
                
                let queryUsrDiscountUpd = "UPDATE users SET user_discount=? WHERE user_id=?";
                this.database.executeSql(queryUsrDiscountUpd, [usrdiscount, 1]).then(res => {}).catch(e => console.log(e));

              }
            }).catch(e => console.log(e));

          }

          // USER WORK POSITION
          if(oldUsr[0].usrData.user_work_pos == '2' || oldUsr[0].usrData.user_work_pos == '3' || oldUsr[0].usrData.user_work_pos == '4') {

            let user_work_pos = oldUsr[0].usrData.user_work_pos;
            let queryUsrWP = "SELECT * FROM users WHERE user_id=? AND user_work_pos=? AND user_del = '0' LIMIT 1";
            this.database.executeSql(queryUsrWP, [1, user_work_pos]).then(suc3 => {
              if(suc3.rows.length == 0) {
                
                let queryUsrWPUpd = "UPDATE users SET user_work_pos=? WHERE user_id=?";
                this.database.executeSql(queryUsrWPUpd, [user_work_pos, 1]).then(suc4 => {}).catch(e => console.log(e));

              }
            }).catch(e => console.log(e));

          }
          // IF NO CONNECTION TO DB OR SERVER IS DOWN
          else if(oldUsr[0].usrData.user_work_pos != '1000') {

            let user_work_pos = oldUsr[0].usrData.user_work_pos;
            let queryUsrWP = "SELECT * FROM users WHERE user_id=? AND user_work_pos=? AND user_del = '0' LIMIT 1";
            this.database.executeSql(queryUsrWP, [1, user_work_pos])
            .then(suc2 => {
              if(suc2.rows.length == 0) {
                
                let queryUsrWPUpd = "UPDATE users SET user_work_pos=? WHERE user_id=?";
                this.database.executeSql(queryUsrWPUpd, [user_work_pos, 1])
                .then(suc3 => {})
                .catch(e => console.log(e));

              }
            })
            .catch(e => console.log(e));

          }

          // DB POINTS
          let pointsArr = oldUsr[0].pointsArr;

          if(pointsArr.length > 0) {
            
            this.pointsArrFunc(0, pointsArr);

          }

          // DB WALLET
          let walletArr = oldUsr[0].walletArr;

          if(walletArr.length > 0) {

              let wallet_user = walletArr[0]['wallet_user'];
              let wallet_institution = walletArr[0]['wallet_institution'];
              let wallet_total = walletArr[0]['wallet_total'];
              let wallet_warn = walletArr[0]['wallet_warn'];
              let wallet_when = walletArr[0]['wallet_when'];
              let wallet_del = walletArr[0]['wallet_del'];

              let queryWallet = "SELECT * FROM wallet WHERE wallet_when < ?";
              this.database.executeSql(queryWallet, [wallet_when])
              .then(suc => {
                if(suc.rows.length > 0) {
                  let walletUpd = "UPDATE wallet SET wallet_institution=?, wallet_total=?, wallet_when=?, wallet_warn=?, wallet_del=?  WHERE wallet_user=?";
                  this.database.executeSql(walletUpd, [wallet_institution, wallet_total, wallet_when, wallet_warn, wallet_del, wallet_user])
                  .then(() => {})
                  .catch(() => {});
                }
              })
              .catch(() => {});

          }

          // DB CHAT
          let chatArr = oldUsr[0].chatArr;
          
          if(chatArr.length > 0) {

            this.chatArrFunc(0, chatArr);

          }

          let user_name = oldUsr[0].usrData['user_name'];
          let user_surname = oldUsr[0].usrData['user_surname'];
          let user_middlename = oldUsr[0].usrData['user_middlename'];
          let user_email = oldUsr[0].usrData['user_email'];
          let user_email_confirm = oldUsr[0].usrData['user_email_confirm'];
          let user_pwd = oldUsr[0].usrData['user_pwd'];
          let user_tel = oldUsr[0].usrData['user_tel'];
          let user_info = oldUsr[0].usrData['user_info'];
          let user_pic = oldUsr[0].usrData['user_pic'];
          let user_gender = oldUsr[0].usrData['user_gender'];
          let user_birthday = oldUsr[0].usrData['user_birthday'];
          let user_country = oldUsr[0].usrData['user_country'];
          let user_region = oldUsr[0].usrData['user_region'];
          let user_city = oldUsr[0].usrData['user_city'];
          let user_adress = oldUsr[0].usrData['user_adress'];
          let user_install_where = oldUsr[0].usrData['user_install_where'];
          let user_log_key = oldUsr[0].usrData['user_log_key'];
          let user_promo = oldUsr[0].usrData['user_promo'];
          let user_del = oldUsr[0].usrData['user_del'];

          // DB USER
          let usrUpd = "UPDATE users SET user_name=?, user_surname=?, user_middlename=?, user_email=?, user_email_confirm=?, user_pwd=?, user_tel=?, user_info=?, user_pic=?, user_gender=?, user_birthday=?, user_country=?, user_region=?, user_city=?, user_adress=?, user_install_where=?, user_log_key=?, user_promo=?, user_del=? WHERE user_id=?";
          this.database.executeSql(usrUpd, [user_name, user_surname, user_middlename, user_email, user_email_confirm, user_pwd, user_tel, user_info, user_pic, user_gender, user_birthday, user_country, user_region, user_city, user_adress, user_install_where, user_log_key, user_promo, user_del, 1]).then(res => {}).catch(e => console.log(e));

        }
      }

    })
    .catch(e => console.log(e));
  }

  smsRequestOk(val) {
    let queryUsrSmsUpd = "UPDATE users SET user_conf_req=?, user_upd=? WHERE user_id=?";
    this.database.executeSql(queryUsrSmsUpd, [val, val, 1])
    .then(suc => {})
    .catch(e => console.log(e));
  }

  cancelOrder(val) {
    return new Promise(resolve => {
      setTimeout(() => {

        let jsonstr = {
          inst_id: this.institution,
          newusr: 'calender',
          device_id: this.uuid,
          getset: 2,
          orderId: val
        };

        this.httpRequest(JSON.stringify(jsonstr))
        .subscribe(suc => {
          if(suc[0].orderOK == '7') {
              resolve(0);
          }
          else if(suc[0].orderOK == '6') {
            this.database.executeSql("UPDATE ordering SET order_status=? WHERE order_id=?", [4, val])
            .then(res => {
              resolve(1);
            })
            .catch(e => resolve(e));
          }
        }, e => resolve(e));

      });
    });
  }

  getOrders() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM ordering WHERE order_user = ? AND order_status != ? AND order_start > ? AND order_del = ? ORDER BY order_id DESC LIMIT 20", [this.myid, '4', this.serverdateraw, '0'])
        .then(suc => {
          let ordering = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              ordering.push(suc.rows.item(i));
            }
            resolve(ordering);
          }
          else {
            resolve(ordering);
          }
        })
        .catch(e => resolve(e));
      }, 1000);
    });
  }

  saveRequestRes(val, item, answer) {
    let asksreq = val[0];
    if(asksreq.asksOK == 1) {
      let answers = 'reply: '+answer;
      this.database.executeSql("UPDATE asks SET asks_reply=?, asks_when=?, asks_active='1' WHERE asks_id=?", [answers, parseInt(asksreq.asks_when), parseInt(item)])
      .then(res => {})
      .catch(e => console.log(e));
    }
  }
  
  questsPush(x) {
    if(x.asks_type == '0') {
      var answsplit = x.asks_answ.split(',');
      var answarr = [];
      for(var a=0;a<answsplit.length;a++) {
        answarr.push(answsplit[a]);
      }
      x.asks_answ = answarr;
      this.quests.push(x);
    }
    else {
      this.quests.push(x);
    }
      return this.quests;
  }

  getSurveys() {
    this.quests = [];
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM asks WHERE asks_reply = ? AND asks_active='0' AND asks_del = '0' ORDER BY asks_id DESC, asks_chained ASC", ['0'])
        .then(suc => {
          if(suc.rows.length > 0) {
            let ischained = 0;
            let istaken = 0;
            for(let i=0;i<suc.rows.length;i++) {
              if(suc.rows.item(i).asks_del == '0' && suc.rows.item(i).asks_active == '0') {
                if((suc.rows.item(i).asks_chained != '0' && istaken == 0) || (ischained != 0 && istaken == 0)) {
                  
                  if(suc.rows.item(i).asks_chained != '0' && ischained == 0) {
                    ischained = suc.rows.item(i).asks_chained;
                    this.questsPush(suc.rows.item(i));
                  }
                  else if(ischained == suc.rows.item(i).asks_chained) {
                    this.questsPush(suc.rows.item(i));
                  }

                }
                else if(istaken == 0 && ischained == 0) {

                  istaken = 1;
                  if(suc.rows.item(i).asks_type == '0') {
                    this.questsPush(suc.rows.item(i));
                  }

                }
              }
            }
            return resolve(this.quests);
          }
          else {
            return resolve(this.quests);
          }
        })
        .catch(e => console.log(e));
      }, 1000);
    });
  }

  getFAQ() {
    return this.faq;
  }

  getCards() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM gifts WHERE gifts_del='0' AND gifts_points='0' ORDER BY gifts_when DESC", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).gifts_name = this.decodeEntities(suc.rows.item(i).gifts_name);
              suc.rows.item(i).gifts_desc = this.decodeEntities(suc.rows.item(i).gifts_desc);
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getInstitutions(val) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM organizations WHERE org_id='"+val+"' AND org_del = '0'", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).org_name = this.decodeEntities(suc.rows.item(i).org_name);
              suc.rows.item(i).org_adress = this.decodeEntities(suc.rows.item(i).org_adress);
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getLastGifts() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM gifts WHERE gifts_del='0' AND gifts_points != '0' ORDER BY gifts_when DESC LIMIT 2", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).gifts_name = this.decodeEntities(suc.rows.item(i).gifts_name);
              suc.rows.item(i).gifts_desc = this.decodeEntities(suc.rows.item(i).gifts_desc);
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getWallet() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM wallet WHERE wallet_user = '"+this.myid+"'", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getProfile() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM users WHERE user_id = '1'", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).user_name = this.decodeEntities(suc.rows.item(i).user_name);
              suc.rows.item(i).user_surname = this.decodeEntities(suc.rows.item(i).user_surname);
              suc.rows.item(i).user_middlename = this.decodeEntities(suc.rows.item(i).user_middlename);
              suc.rows.item(i).user_email = this.decodeEntities(suc.rows.item(i).user_email);
              suc.rows.item(i).user_adress = this.decodeEntities(suc.rows.item(i).user_adress);
              if(suc.rows.item(i).user_birthday == '0000-00-00') {
                suc.rows.item(i).user_birthday = this.datetoday.getFullYear()-15 + '-' + this.datetoday.getMonth() + '-' + this.datetoday.getDate();
              }
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getAbout() {
    return this.about;
  }
  
  getGifts() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM gifts WHERE gifts_del='0' AND gifts_points!='0' ORDER BY gifts_when DESC", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).gifts_name = this.decodeEntities(suc.rows.item(i).gifts_name);
              suc.rows.item(i).gifts_desc = this.decodeEntities(suc.rows.item(i).gifts_desc);
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getFirstGifts() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM gifts WHERE gifts_id != '0' AND gifts_when = '2' AND gifts_del = '0' LIMIT 1", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            res.push(suc.rows.item(0));
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getShareDetails() {
    return this.sharedetails;
  }

  getShare() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM organizations WHERE org_del = '0'", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).org_name = this.decodeEntities(suc.rows.item(i).org_name);
              suc.rows.item(i).org_adress = this.decodeEntities(suc.rows.item(i).org_adress);
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getTerms() {
    return this.terms;
  }

  getNews() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM news WHERE news_state='1' AND news_del='0' ORDER BY news_when DESC", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).news_name = this.decodeEntities(suc.rows.item(i).news_name);
              suc.rows.item(i).news_message = this.decodeEntities(suc.rows.item(i).news_message);
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getGoods() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM goods WHERE goods_del='0' ORDER BY goods_id DESC", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getRituals(type) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM menue WHERE menue_cat='"+type+"' ORDER BY menue_when ASC", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).menue_name = this.decodeEntities(suc.rows.item(i).menue_name);
              suc.rows.item(i).menue_desc = this.decodeEntities(suc.rows.item(i).menue_desc);
              suc.rows.item(i).menue_action = this.decodeEntities(suc.rows.item(i).menue_action);
              suc.rows.item(i).in_id = i;
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getServices() {
    return this.services;
  }

  getDates() {
    return new Promise(resolve => {
      setTimeout(() => {
        let res = [];
        let queryUsrLog = "SELECT * FROM users WHERE user_id=? LIMIT 1";
        this.database.executeSql(queryUsrLog, [1])
        .then(suc => {
          if(suc.rows.length > 0) {
            
            let corrtime: any = this.timezoneAdd(suc.rows.item(0).user_log);
            this.serverdate = new Date(corrtime*1000);
            this.serverdateraw = suc.rows.item(0).user_log;
            setTimeout(() => {
              // every day 2 weeks
              for(let i=0;i<14;i++) {
                res.push({dat: this.crnewdate(this.serverdate, i)});
              }
              resolve(res);
            }, 200);

          }
        })
        .catch(e => resolve(e));
      }, 1000);
    });
  }

  getHistory() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM ordering WHERE order_order > '0' AND order_del = '0' ORDER BY order_id DESC LIMIT 1", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              res.push(suc.rows.item(i));
            }
            resolve(res);
          }
          else {
            resolve(res);
          }
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getOffices() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM organizations_office ORDER BY office_id DESC", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              suc.rows.item(i).in_id = i;
              suc.rows.item(i).office_tel = suc.rows.item(i).office_tel.split(',');
              suc.rows.item(i).office_bus_hours = suc.rows.item(i).office_bus_hours.split(',');
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getProfessions() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM professions ORDER BY prof_id DESC", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  getProfession(val) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM professions WHERE prof_id='"+val+"'", {})
        .then(suc => {
          let res = [];
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              res.push(suc.rows.item(i));
            }
          }
          resolve(res);
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  loadSchedule() {
    let serverdaterawnew = new Date(this.serverdateraw*1000);
    let datebegin = (this.crnewdate(serverdaterawnew, 0).setHours(0,0,0,0)/1000).toFixed(0);
    let dateend = (this.crnewdate(serverdaterawnew, 14).setHours(23,59,59,999)/1000).toFixed(0);
    this.database.executeSql("SELECT * FROM schedule WHERE schedule_stop >= '"+datebegin+"' AND schedule_stop < '"+dateend+"' AND schedule_del = '0'", {})
    .then(suc => {
      if(suc.rows.length > 0) {
        for(let i=0;i<suc.rows.length;i++) {
          this.schedules.push(suc.rows.item(i));
        }
      }
    })
    .catch(er => {
      console.log(er);
    });
  }

  loadOrdering() {
    this.database.executeSql("SELECT * FROM ordering WHERE order_del = '0'", {})
    .then(suc => {
      if(suc.rows.length > 0) {
        for(let i=0;i<suc.rows.length;i++) {
          this.orderings.push(suc.rows.item(i));
        }
      }
    })
    .catch(er => {
      console.log(er);
    });
  }

  loadRoom() {
    this.database.executeSql("SELECT * FROM rooms WHERE room_del = '0' ORDER BY room_priority DESC", {})
    .then(suc => {
      if(suc.rows.length > 0) {
        for(let i=0;i<suc.rows.length;i++) {
          this.rooms.push(suc.rows.item(i));
        }
      }
    })
    .catch(er => {
      console.log(er);
    });
  }

  // BEGIN OF - TAKE MASTER AND MASTER HISTORY ---------------------------------

  checkWorkTimeForRandomHist() {
    // console.log('YES 11')
    return new Promise(resolve => {
      setTimeout(() => {
        let res = [];
        if(this.mastersearl.length > 0) {
          let l = this.mastersearl.length-1;
          while(this.mastersearl[l]) {
            if(this.mastersearl[l].in_id > 0) {
              if(this.mastersearl[l].user_work_time.length > 0) {
                let times = this.mastersearl[l].user_work_time;
                for(let i=0;i<times.length;i++) {
                  let exists = 0;
                  let masterlength = this.mastersearl[0].user_work_time.length;
                  if(masterlength > 0) {
                    for(let j=0;j<masterlength;j++) {
                      if(this.mastersearl[0].user_work_time[j].unixtime == times[i].unixtime && exists == 0) {
                        exists = 1;
                      }
                      else if(j == masterlength-1 && exists == 0) {
                        this.mastersearl[0].user_work_time.push(times[i]);
                      }
                    }
                  }
                  else if(masterlength == 0) {
                    this.mastersearl[0].user_work_time.push(times[i]);
                  }
                }
              }
              else if(this.mastersearl[l].user_work_time.length == 0) {
                this.mastersearl.splice(l, 1);
              }
            }
            l--;
          }
        }
        resolve(res);
      }, 1000);
    });
  }

  getWorkingTimeHist(user_work_time, onlDateDate, onlDateTime, mastr, v, limit) {
    // console.log('YES 10')
    let stopgo = 0;
    if(user_work_time.length == 0) {
      this.checkedmasters1++;
      user_work_time.push({dayday: onlDateDate, daytime: onlDateTime, unixtime: v});
    }
    else if(user_work_time.length > 0) {
      this.checkedmasters1++;
      for(let i=0;i<user_work_time.length;i++) {
        this.checkedmasters1++;
        if(stopgo == 0) {
          if(user_work_time[i].daytime == onlDateTime) {
            stopgo = 1;
          }
          else if(i==user_work_time.length-1) {
            user_work_time.push({dayday: onlDateDate, daytime: onlDateTime, unixtime: v});
            stopgo = 1;
          }
        }
      }
    }
  }

  getOrderingRoomsHist(userid, v, officesel, officeselmenue, roomid, limit) {
    // console.log('YES 9 ')
    let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    // GET ORDERING ROOMS (IF IS FREE AT THIS TIME)
    let orderinglength = this.orderings.length;
    let orderexist = 0;
    if(orderinglength > 0) {
      for(let i=0;i<orderinglength;i++) {
        this.checkedmasters1++;
        let orderstart: any = this.timezoneAdd(this.orderings[i].order_start);
        let orderstop: any = this.timezoneAdd(this.orderings[i].order_end);
        if(this.orderings[i].order_office == officesel.office_id && this.orderings[i].order_room == roomid && orderstart <= v && orderstop > v) {
          orderexist = 1;
        }
        if(i==orderinglength-1) {
          if(orderexist==0) {
            let gottime: any = this.timezoneAdd(v);
                gottime = gottime * 1000;
            let onltime = new Date(gottime);
            let onlDateTime;
            let onlDateDate;
            let onlMonth;
            let onlDay;
            let onlHour;
            let onlMin;

            if(onltime.getMonth() < 9) {
              onlMonth = '0' + (onltime.getMonth() + 1);
            } 
            else {
              onlMonth = onltime.getMonth() + 1;
            }
            if(onltime.getDate() < 10) {
              onlDay = '0' + onltime.getDate();
            } 
            else {
              onlDay = onltime.getDate();
            }
            if(onltime.getHours() < 10) {
                onlHour = '0' + onltime.getHours();
            } 
            else {
                onlHour = onltime.getHours();
            }
            if(onltime.getMinutes() < 10) {
                onlMin = '0' + onltime.getMinutes();
            } 
            else {
                onlMin = onltime.getMinutes();
            }
            onlDateTime =  onlHour + '' + onlMin;
            onlDateDate = onlDay + ' ' + months[onltime.getMonth()];
            for(let b=0;b<this.mastersearl.length;b++) {
              this.checkedmasters1++;
              if(userid == this.mastersearl[b].user_real_id) {
                if(this.mastersearl[b].user_work_time && this.serverdate.getTime() < onltime.getTime()) {
                    this.getWorkingTimeHist(this.mastersearl[b].user_work_time, onlDateDate, onlDateTime, this.mastersearl[b], v, limit);
                    orderexist = 1;
                }
              }
            }
          }
        }
      }
    }
    else if(orderinglength == 0) {
      if(orderexist == 0) {
        this.checkedmasters1++;
        let gottime: any = this.timezoneAdd(v);
            gottime = gottime * 1000;
        let onltime = new Date(gottime);
        let onlDateTime;
        let onlDateDate;
        let onlMonth;
        let onlDay;
        let onlHour;
        let onlMin;
        
        if(onltime.getMonth() < 9) {
          onlMonth = '0' + (onltime.getMonth() + 1);
        } 
        else {
          onlMonth = onltime.getMonth() + 1;
        }
        if(onltime.getDate() < 10) {
          onlDay = '0' + onltime.getDate();
        } 
        else {
          onlDay = onltime.getDate();
        }
        if(onltime.getHours() < 10) {
            onlHour = '0' + onltime.getHours();
        } 
        else {
            onlHour = onltime.getHours();
        }
        if(onltime.getMinutes() < 10) {
            onlMin = '0' + onltime.getMinutes();
        } 
        else {
            onlMin = onltime.getMinutes();
        }
        onlDateTime = onlHour + '' + onlMin;
        onlDateDate = onlDay + ' ' + months[onltime.getMonth()];
        for(let b=0;b<this.mastersearl.length;b++) {
          this.checkedmasters1++;
          if(userid == this.mastersearl[b].user_real_id) {
            if(this.mastersearl[b].user_work_time && this.serverdate.getTime() < onltime.getTime()) {
                this.getWorkingTimeHist(this.mastersearl[b].user_work_time, onlDateDate, onlDateTime, this.mastersearl[b], v, limit);
                orderexist = 1;
            }
          }
        }
      }
    }
  }

  selRoomHist(userid, v, officesel, officeselmenue, limit) {
    // console.log('YES 8')
    // GET ROOMS WHITH EXECUTION OF THIS MENU
    let roomslength = this.rooms.length;
    let varmenue1 = ','+officeselmenue+',';
    let varmenue2 = officeselmenue+',';
    let varmenue3 = ','+officeselmenue;
    let varmenue4 = officeselmenue;
    let varemployee1 = ','+userid+',';
    let varemployee2 = userid+',';
    let varemployee3 = ','+userid;
    let varemployee4 = userid;
    if(roomslength > 0) {
      for(let i=0;i<roomslength;i++) {
        this.checkedmasters1++;
        if((this.rooms[i].room_menue_exe.indexOf(varmenue1) >= 0 || this.rooms[i].room_menue_exe.indexOf(varmenue2) >= 0 || this.rooms[i].room_menue_exe.indexOf(varmenue3) >= 0 || this.rooms[i].room_menue_exe == varmenue4) && (this.rooms[i].room_employee.indexOf(varemployee1) >= 0 || this.rooms[i].room_employee.indexOf(varemployee2) >= 0 || this.rooms[i].room_employee.indexOf(varemployee3) >= 0 || this.rooms[i].room_employee == varemployee4) && this.rooms[i].room_office == officesel.office_id) {
          this.getOrderingRoomsHist(userid, v, officesel, officeselmenue, this.rooms[i].room_id, limit);
        }
      }
    }
  }

  checkRoomsHist(userid, v, officesel, limit) {
    // console.log('YES 7')
    let officeselmenue = officesel.office_menue.split(',');
    for(let i=0;i<officeselmenue.length;i++) {
      this.checkedmasters1++;
      this.selRoomHist(userid, v, officesel, officeselmenue[i], limit);
    }
  }

  checkOrderingHist(userid, v, interval, officesel, limit) {
    // console.log('YES 6')
    // GET ORDERING (IF EMPLOYEE IS FREE AT THIS TIME)
    let lastV = v - interval;
    let orderinglength = this.orderings.length;
    let orderexist = 0;
    if(orderinglength > 0) {
      for(let i=0;i<orderinglength;i++) {
        this.checkedmasters1++;
        let orderstart = this.orderings[i].order_start;
        if(this.orderings[i].order_worker == userid && orderstart <= v && orderstart > lastV) {
          orderexist = 1;
        }
        else if(i==orderinglength-1) {
          if(orderexist == 0) {
            this.checkRoomsHist(userid, v, officesel, limit);
          }
        }
      }
    }
    else if(orderinglength == 0) {
      this.checkRoomsHist(userid, v, officesel, limit);
    }
  }

  checkScheduleOrderHist(userid, schedule, interval, officesel, limit) {
    // console.log('YES 5')
    for(let i=schedule.schedule_start;i<schedule.schedule_stop;i+=interval) {
      this.checkedmasters1++;
      this.checkOrderingHist(userid, i, interval, officesel, limit);
    }
  }

  checkScheduleHist3Days(userid, interval, dates, officesel, limit) {
    // console.log('YES 4')
    let datebegin = (new Date(dates*1000).setHours(0,0,0,0)/1000).toFixed(0);
    let dateend = (new Date(dates*1000).setHours(23,59,59,999)/1000).toFixed(0);
    let schedulelength = this.schedules.length;
    if(schedulelength > 0) {
      for(let i=0;i<schedulelength;i++) {
        this.checkedmasters1++;
        let schedulestart: any = this.timezoneAdd(this.schedules[i].schedule_start);
        if(this.schedules[i].schedule_employee == userid && schedulestart >= datebegin && schedulestart < dateend) {
          this.checkScheduleOrderHist(userid, this.schedules[i], interval, officesel, limit);
        }
      }
    }
  }

  checkScheduleHist(userid, interval, officesel, limit) {
    // console.log('YES 3')
    let daysfuture = 3;
    for(let d=0;d<daysfuture;d++) {
      let dates = parseInt(this.serverdateraw)+(86400*d);
      this.checkScheduleHist3Days(userid, interval, dates, officesel, limit);
    }
  }

  checkOfficeHist(userid, interval, officesel, limit) {
    // console.log('YES 2')
    for(let i=0;i<officesel.length;i++) {
      this.checkedmasters1++;
      this.checkScheduleHist(userid, interval, officesel[i], limit);
    }
  }

  getMastersHist(ritual, interval, officesel, userid, limit) {
    // console.log('YES 1 ')
    this.mastersearl = [];
    this.checkedmasters1 = 0;
    this.checkedmasters2 = 0;
    return new Promise(resolve => {
      setTimeout(() => {
        let sqlreq = "SELECT * FROM users WHERE user_work_pos>'1' AND (user_menue_exe LIKE '%,"+ritual+",%' OR user_menue_exe LIKE '"+ritual+",%' OR user_menue_exe LIKE '%,"+ritual+"' OR user_menue_exe = '"+ritual+"') AND user_del='0' ORDER BY user_id ASC";
        if(ritual == 0) {
          sqlreq = "SELECT * FROM users WHERE user_id>'1' AND user_work_pos>'1' AND user_del='0' ORDER BY user_id ASC";
        }
        if(userid == '-') {
          this.mastersearl.push({"in_id": 0,"user_city":null,"user_device_serial":null,"user_log":null,"user_pic":null,"user_reg":null,"user_menue_exe":"all","user_institution":this.institution,"user_del":0,"user_id":null,"user_email_confirm":null,"user_real_id":null,"user_name":"любой мастер","user_region":null,"user_pwd":null,"user_device_version":null,"user_upd":null,"user_conf_req":null,"user_middlename":"","user_country":null,"user_discount":null,"user_gender":null,"user_adress":null,"user_tel":null,"user_gcm":null,"user_log_key":null,"user_birthday":null,"user_mob":null,"user_info":null,"user_office":null,"user_install_where":null,"user_promo":null,"user_email":null,"user_device":null,"user_device_id":null,"user_surname":"","user_device_os":null,"user_work_pos":2,"user_mob_confirm":null,"user_work_time":[]});
        }
        this.database.executeSql(sqlreq, {})
        .then(suc => {
          if(suc.rows.length > 0) {
            if(userid > 0) {
              for(let i=0;i<suc.rows.length;i++) {
                if(userid == suc.rows.item(i).user_real_id) {
                  suc.rows.item(i).in_id = i+1;
                  suc.rows.item(i).user_work_time = [];
                  this.mastersearl.push(suc.rows.item(i));
                  this.checkOfficeHist(suc.rows.item(i).user_real_id, interval, officesel, limit);
                }

                if(i==suc.rows.length-1) {
                  this.checkintervalearl = setInterval(() => {
                    if(this.checkedmasters1 == this.checkedmasters2) {
                      clearInterval(this.checkintervalearl);
                      if(userid == '-') {
                        this.checkWorkTimeForRandomHist().then(() => {
                          let p = this.mastersearl.length-1;
                          while(this.mastersearl.length) {
                            if(this.mastersearl[p].in_id != 0) {
                              this.mastersearl.splice(p, 1);
                            }
                            if(p==0) {
                              resolve(this.mastersearl);
                            }
                            p--;
                          }
                        });
                      }
                      else {
                        if(this.mastersearl.length > 0) {
                          for(let p=0;p<this.mastersearl.length;p++) {
                            this.mastersearl[p].in_id = p;
                            if(p==this.mastersearl.length-1) {
                              resolve(this.mastersearl);
                            }
                          }
                        }
                        else {
                          resolve(this.mastersearl);
                        }
                      }
                    }
                    else {
                      this.checkedmasters2 = this.checkedmasters1;
                    }
                  }, 1000);
                }

              }
            }
            else {
              for(let i=0;i<suc.rows.length;i++) {
                
                suc.rows.item(i).in_id = i+1;
                suc.rows.item(i).user_work_time = [];
                this.mastersearl.push(suc.rows.item(i));

                if(i==suc.rows.length-1) {
                  this.checkOfficeHist(suc.rows.item(i).user_real_id, interval, officesel, limit);
                  
                  this.checkintervalearl = setInterval(() => {
                    if(this.checkedmasters1 == this.checkedmasters2) {
                      clearInterval(this.checkintervalearl);
                      if(userid == '-') {
                        this.checkWorkTimeForRandomHist().then(() => {
                          let p = this.mastersearl.length-1;
                          while(this.mastersearl.length) {
                            if(this.mastersearl[p].in_id != 0) {
                              this.mastersearl.splice(p, 1);
                            }
                            if(p==0) {
                              resolve(this.mastersearl);
                            }
                            p--;
                          }
                        });
                      }
                      else {
                        if(this.mastersearl.length > 0) {
                          for(let p=0;p<this.mastersearl.length;p++) {
                            this.mastersearl[p].in_id = p;
                            if(p==this.mastersearl.length-1) {
                              resolve(this.mastersearl);
                            }
                          }
                        }
                        else {
                          resolve(this.mastersearl);
                        }
                      }
                    }
                    else {
                      this.checkedmasters2 = this.checkedmasters1;
                    }
                  }, 1000);
                }
                else {
                  this.checkOfficeHist(suc.rows.item(i).user_real_id, interval, officesel, limit);
                }

              }
            }
          }
          else {
            resolve(this.mastersearl);
          }
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  // END OF - TAKE MASTER AND MASTER HISTORY ---------------------------------

  // BEGIN OF - TAKE MASTER AND MASTER EARLIEST WORKTIME SECTION ---------------------------------

  getWorkingTimeEarl(user_work_time, onlDateDate, onlDateTime, mastr, v) {
    let stopgo = 0;
    if(user_work_time.length == 0) {
      mastr.user_work_time.push({dayday: onlDateDate, daytime: onlDateTime, unixtime: v});
    }
    else {
      for(let i=0;i<user_work_time.length;i++) {
        if(stopgo == 0) {
          if(user_work_time[i].dayday == onlDateDate) {
            stopgo = 1;
          }
          else if(i==user_work_time.length-1 && user_work_time[i].dayday != onlDateDate) {
            mastr.user_work_time.push({dayday: onlDateDate, daytime: onlDateTime, unixtime: v});
          }
        }
      }
    }
  }

  getOrderingRoomsEarl(userid, v, ritual, officesel, officeselmenue, roomid) {
    let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    // GET ORDERING ROOMS (IF IS FREE AT THIS TIME)
    let orderinglength = this.orderings.length;
    let orderexist = 0;
    if(orderinglength > 0) {
      for(let i=0;i<orderinglength;i++) {
        this.checkedmasters1++;
        let orderstart = this.orderings[i].order_start;
        let orderstop = this.orderings[i].order_end;
        if(this.orderings[i].order_office == officesel.office_id && this.orderings[i].order_room == roomid && orderstart <= v && orderstop > v) {
          orderexist = 1;
        }
        if(i==orderinglength-1) {
          if(orderexist==0) {
            let gottime: any = this.timezoneAdd(v);
                gottime = gottime * 1000;
            let onltime = new Date(gottime);
            let onlDateTime;
            let onlDateDate;
            let onlMonth;
            let onlDay;
            let onlHour;
            let onlMin;
            
            if(onltime.getMonth() < 9) {
              onlMonth = '0' + (onltime.getMonth() + 1);
            } else {
              onlMonth = onltime.getMonth() + 1;
            }
            if(onltime.getDate() < 10) {
              onlDay = '0' + onltime.getDate();
            } else {
              onlDay = onltime.getDate();
            }
            if(onltime.getHours() < 10) {
                onlHour = '0' + onltime.getHours();
            } 
            else {
                onlHour = onltime.getHours();
            }
            if(onltime.getMinutes() < 10) {
                onlMin = '0' + onltime.getMinutes();
            } 
            else {
                onlMin = onltime.getMinutes();
            }
            onlDateTime =  onlHour + '' + onlMin;
            onlDateDate = onlDay + ' ' + months[onltime.getMonth()];
            for(let b=0;b<this.mastersearl.length;b++) {
              this.checkedmasters1++;
              if(userid == this.mastersearl[b].user_real_id) {
                if(this.mastersearl[b].user_work_time && this.serverdate.getTime() < onltime.getTime()) {
                  this.getWorkingTimeEarl(this.mastersearl[b].user_work_time, onlDateDate, onlDateTime, this.mastersearl[b], v);
                  orderexist = 1;
                }
              }
            }
          }
        }
      }
    }
    else if(orderinglength == 0) {
      if(orderexist == 0) {
        let gottime: any = this.timezoneAdd(v);
            gottime = gottime * 1000;
        let onltime = new Date(gottime);
        let onlDateTime;
        let onlDateDate;
        let onlMonth;
        let onlDay;
        let onlHour;
        let onlMin;
        
        if(onltime.getMonth() < 9) {
          onlMonth = '0' + (onltime.getMonth() + 1);
        } else {
          onlMonth = onltime.getMonth() + 1;
        }
        if(onltime.getDate() < 10) {
          onlDay = '0' + onltime.getDate();
        } else {
          onlDay = onltime.getDate();
        }
        if(onltime.getHours() < 10) {
            onlHour = '0' + onltime.getHours();
        } 
        else {
            onlHour = onltime.getHours();
        }
        if(onltime.getMinutes() < 10) {
            onlMin = '0' + onltime.getMinutes();
        } 
        else {
            onlMin = onltime.getMinutes();
        }
        onlDateTime = onlHour + '' + onlMin;
        onlDateDate = onlDay + ' ' + months[onltime.getMonth()];
        for(let b=0;b<this.mastersearl.length;b++) {
          this.checkedmasters1++;
          if(userid == this.mastersearl[b].user_real_id) {
            if(this.mastersearl[b].user_work_time && this.serverdate.getTime() < onltime.getTime()) {
              this.getWorkingTimeEarl(this.mastersearl[b].user_work_time, onlDateDate, onlDateTime, this.mastersearl[b], v);
              orderexist = 1;
            }
          }
        }
      }
    }
  }

  selRoomEarl(userid, v, ritual, officesel, officeselmenue) {
    // GET ROOMS WHITH EXECUTION OF THIS MENU
    let roomslength = this.rooms.length;
    let varmenue1 = ','+officeselmenue+',';
    let varmenue2 = officeselmenue+',';
    let varmenue3 = ','+officeselmenue;
    let varmenue4 = officeselmenue;
    let varemployee1 = ','+userid+',';
    let varemployee2 = userid+',';
    let varemployee3 = ','+userid;
    let varemployee4 = userid;
    if(roomslength > 0) {
      for(let i=0;i<roomslength;i++) {
        this.checkedmasters1++;
        if((this.rooms[i].room_menue_exe.indexOf(varmenue1) >= 0 || this.rooms[i].room_menue_exe.indexOf(varmenue2) >= 0 || this.rooms[i].room_menue_exe.indexOf(varmenue3) >= 0 || this.rooms[i].room_menue_exe == varmenue4) && (this.rooms[i].room_employee.indexOf(varemployee1) >= 0 || this.rooms[i].room_employee.indexOf(varemployee2) >= 0 || this.rooms[i].room_employee.indexOf(varemployee3) >= 0 || this.rooms[i].room_employee == varemployee4) && this.rooms[i].room_office == officesel.office_id) {
          this.checkedmasters1++;
          this.getOrderingRoomsEarl(userid, v, ritual, officesel, officeselmenue, this.rooms[i].room_id);
        }
      }
    }
  }

  checkRoomsEarl(userid, v, ritual, officesel) {
    let officeselmenue = officesel.office_menue.split(',');
    for(let i=0;i<officeselmenue.length;i++) {
      this.checkedmasters1++;
      this.selRoomEarl(userid, v, ritual, officesel, officeselmenue[i]);
    }
  }

  checkOrderingEarl(userid, v, interval, ritual, officesel) {
    // GET ORDERING (IF EMPLOYEE IS FREE AT THIS TIME)
    let lastV = v - interval;
    let orderinglength = this.orderings.length;
    let orderexist = 0;
    if(orderinglength > 0) {
      for(let i=0;i<orderinglength;i++) {
        this.checkedmasters1++;
        let orderstart = this.orderings[i].order_start;
        if(this.orderings[i].order_worker == userid && orderstart <= v && orderstart > lastV) {
          orderexist = 1;
        }
        else if(i==orderinglength-1) {
          if(orderexist == 0) {
            this.checkRoomsEarl(userid, v, ritual, officesel);
          }
        }
      }
    }
    else if(orderinglength == 0) {
      this.checkRoomsEarl(userid, v, ritual, officesel);
    }
  }

  checkScheduleOrderEarl(userid, schedule, interval, ritual, officesel) {
    for(let i=schedule.schedule_start;i<schedule.schedule_stop;i+=interval) {
      this.checkedmasters1++;
      this.checkOrderingEarl(userid, i, interval, ritual, officesel);
    }
  }

  checkScheduleEarl3Days(userid, interval, dates, ritual, officesel) {
    let datebegin: any = (new Date(dates*1000).setHours(0,0,0,0)/1000).toFixed(0);
    let dateend: any = (new Date(dates*1000).setHours(23,59,59,999)/1000).toFixed(0);
    let schedulelength = this.schedules.length;
    if(schedulelength > 0) {
      for(let i=0;i<schedulelength;i++) {
        this.checkedmasters1++;
        let schedulestart: any = this.timezoneAdd(this.schedules[i].schedule_start);
        if(this.schedules[i].schedule_employee == userid && schedulestart >= datebegin && schedulestart < dateend) {
          this.checkScheduleOrderEarl(userid, this.schedules[i], interval, ritual, officesel);
        }
      }
    }
  }

  checkScheduleEarl(userid, interval, ritual, officesel) {
    let daysfuture = 3;
    for(let d=0;d<daysfuture;d++) {
      let dates = parseInt(this.serverdateraw)+(86400*d);
      this.checkScheduleEarl3Days(userid, interval, dates, ritual, officesel);
    }
  }

  checkOfficeEarl(userid, interval, ritual, officesel) {
    for(let i=0;i<officesel.length;i++) {
      this.checkScheduleEarl(userid, interval, ritual, officesel[i]);
    }
  }

  getMastersEarl(ritual, interval, officesel) {
    this.mastersearl = [];
    this.checkedmasters1 = 0;
    this.checkedmasters2 = 0;
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM users WHERE user_work_pos>'1' AND (user_menue_exe LIKE '%,"+ritual+",%' OR user_menue_exe LIKE '"+ritual+",%' OR user_menue_exe LIKE '%,"+ritual+"' OR user_menue_exe = '"+ritual+"') AND user_del='0' ORDER BY user_id ASC", {})
        .then(suc => {
          if(suc.rows.length > 0) {
            for(let i=0;i<suc.rows.length;i++) {
              
              suc.rows.item(i).in_id = i+1;
              suc.rows.item(i).user_work_time = [];
              this.mastersearl.push(suc.rows.item(i));

              if(i==suc.rows.length-1) {
                this.checkOfficeEarl(this.mastersearl[i].user_real_id, interval, ritual, officesel);
                
                this.checkintervalearl = setInterval(() => {
                  if(this.checkedmasters1 == this.checkedmasters2) {
                    clearInterval(this.checkintervalearl);
                    for(let p=0;p<this.mastersearl.length;p++) {
                      this.mastersearl[p].in_id = p;
                      if(p==this.mastersearl.length-1) {
                        resolve(this.mastersearl);
                      }
                    }
                  }
                  else {
                    this.checkedmasters2 = this.checkedmasters1;
                  }
                }, 2000);
              }
              else {
                this.checkOfficeEarl(suc.rows.item(i).user_real_id, interval, ritual, officesel);
              }
            }
          }
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  // END OF - TAKE MASTER AND MASTER EARLIEST WORKTIME SECTION ---------------------------------

  // BEGIN OF - TAKE MASTER AND MASTER WORKTIME SECTION ---------------------------------

  setWorkTimeForRandom(times, unix) {
    for(let i=0;i<times.length;i++) {
      if(this.masters[0].user_work_time.indexOf(times[i]) == '-1') {
        this.masters[0].user_work_time.push(times[i]);
        this.masters[0].unixtime.push(unix[i]);
      }
    }
  }

  checkWorkTimeForRandom() {
    return new Promise(resolve => {
      setTimeout(() => {
        let res = [];
        if(this.masters.length > 0) {
          let i = this.masters.length-1;
          while(this.masters[i]) {
            if(this.masters[i].in_id > 0) {
              if(this.masters[i].user_work_time.length > 0) {
                this.setWorkTimeForRandom(this.masters[i].user_work_time, this.masters[i].unixtime);
              }
              else if(this.masters[i].user_work_time.length == 0) {
                this.masters.splice(i, 1);
              }
            }
            i--;
          }
        }
        resolve(res);
      }, 1000);
    });
  }

  getOrderingRooms(userid, v, ritual, officesel, officeselmenue, roomid) {
    // GET ORDERING ROOMS (IF IS FREE AT THIS TIME)
    let orderinglength = this.orderings.length;
    let orderexist = 0;
    if(orderinglength > 0) {
      for(let i=0;i<orderinglength;i++) {
        this.checkedmasters1++;
        let orderstart = this.orderings[i].order_start;
        let orderstop = this.orderings[i].order_end;
        if(this.orderings[i].order_office == officesel.office_id && this.orderings[i].order_room == roomid && orderstart <= v && orderstop > v) {
          orderexist = 1;
        }
        if(i==orderinglength-1) {
          if(orderexist==0) {
            let gottime: any = this.timezoneAdd(v);
                gottime = gottime * 1000;
            let onltime = new Date(gottime);
            let onlDateTime;
            let onlHour;
            let onlMin;
            // HOURS AND MINUTES AGO
            if(onltime.getHours() < 10) {
                onlHour = '0' + onltime.getHours();
            }
            else {
                onlHour = onltime.getHours();
            }
            if(onltime.getMinutes() < 10) {
                onlMin = '0' + onltime.getMinutes();
            }
            else {
                onlMin = onltime.getMinutes();
            }
            onlDateTime =  onlHour + '' + onlMin;
            for(let b=0;b<this.masters.length;b++) {
              this.checkedmasters1++;
              if(userid == this.masters[b].user_real_id) {
                if(this.masters[b].user_work_time) {
                  if(this.masters[b].user_work_time.indexOf(onlDateTime) == '-1' && this.serverdate.getTime() < onltime.getTime()) {
                    this.masters[b].user_work_time.push(onlDateTime);
                    this.masters[b].unixtime.push(v);
                  }
                }
              }
            }
          }
        }
      }
    }
    else if(orderinglength == 0) {
      if(orderexist == 0) {
        let gottime: any = this.timezoneAdd(v);
            gottime = gottime * 1000;
        let onltime = new Date(gottime);
        let onlDateTime;
        let onlHour;
        let onlMin;
        // HOURS AND MINUTES AGO
        if(onltime.getHours() < 10) {
            onlHour = '0' + onltime.getHours();
        } 
        else {
            onlHour = onltime.getHours();
        }
        if(onltime.getMinutes() < 10) {
            onlMin = '0' + onltime.getMinutes();
        } 
        else {
            onlMin = onltime.getMinutes();
        }
        onlDateTime =  onlHour + '' + onlMin;
        for(let b=0;b<this.masters.length;b++) {
          this.checkedmasters1++;
          if(userid == this.masters[b].user_real_id) {
            if(this.masters[b].user_work_time) {
              if(this.masters[b].user_work_time.indexOf(onlDateTime) == '-1' && this.serverdate.getTime() < onltime.getTime()) {
                this.masters[b].user_work_time.push(onlDateTime);
                this.masters[b].unixtime.push(v);
              }
            }
          }
        }
      }
    }
  }

  selRoom(userid, v, ritual, officesel, officeselmenue) {
    // GET ROOMS WHITH EXECUTION OF THIS MENU
    let roomslength = this.rooms.length;
    let varmenue1 = ','+officeselmenue+',';
    let varmenue2 = officeselmenue+',';
    let varmenue3 = ','+officeselmenue;
    let varmenue4 = officeselmenue;
    let varemployee1 = ','+userid+',';
    let varemployee2 = userid+',';
    let varemployee3 = ','+userid;
    let varemployee4 = userid;
    if(roomslength > 0) {
      for(let i=0;i<roomslength;i++) {
        this.checkedmasters1++;
        if((this.rooms[i].room_menue_exe.indexOf(varmenue1) >= 0 || this.rooms[i].room_menue_exe.indexOf(varmenue2) >= 0 || this.rooms[i].room_menue_exe.indexOf(varmenue3) >= 0 || this.rooms[i].room_menue_exe == varmenue4) && (this.rooms[i].room_employee.indexOf(varemployee1) >= 0 || this.rooms[i].room_employee.indexOf(varemployee2) >= 0 || this.rooms[i].room_employee.indexOf(varemployee3) >= 0 || this.rooms[i].room_employee == varemployee4) && this.rooms[i].room_office == officesel.office_id) {
          this.checkedmasters1++;
          this.getOrderingRooms(userid, v, ritual, officesel, officeselmenue, this.rooms[i].room_id);
        }
      }
    }
  }

  checkRooms(userid, v, ritual, officesel) {
    let officeselmenue = officesel.office_menue.split(',');
    for(let i=0;i<officeselmenue.length;i++) {
      this.checkedmasters1++;
      this.selRoom(userid, v, ritual, officesel, officeselmenue[i]);
    }
  }

  checkOrdering(userid, v, interval, ritual, officesel) {
    // GET ORDERING (IF EMPLOYEE IS FREE AT THIS TIME)
    let lastV = v - interval;
    let orderinglength = this.orderings.length;
    let orderexist = 0;
    if(orderinglength > 0) {
      for(let i=0;i<orderinglength;i++) {
        this.checkedmasters1++;
        let orderstart = this.orderings[i].order_start;
        if(this.orderings[i].order_worker == userid && orderstart <= v && orderstart > lastV) {
          orderexist = 1;
        }
        else if(i==orderinglength-1) {
          if(orderexist == 0) {
            this.checkRooms(userid, v, ritual, officesel);
          }
        }
      }
    }
    else if(orderinglength == 0) {
      this.checkRooms(userid, v, ritual, officesel);
    }
  }

  checkScheduleOrder(userid, schedule, interval, ritual, officesel) {
    for(let i=schedule.schedule_start;i<schedule.schedule_stop;i+=interval) {
      this.checkedmasters1++;
      this.checkOrdering(userid, i, interval, ritual, officesel);
    }
  }

  checkSchedule(userid, interval, ritual, officesel) {
    let datebegin = (new Date(this.serverdateraw*1000).setHours(0,0,0,0)/1000).toFixed(0);
    let dateend = (new Date(this.serverdateraw*1000).setHours(23,59,59,999)/1000).toFixed(0);
    let schedulelength = this.schedules.length;
    if(schedulelength > 0) {
      for(let i=0;i<schedulelength;i++) {
        this.checkedmasters1++;
        let schedulestart = this.timezoneAdd(this.schedules[i].schedule_start);
        if(this.schedules[i].schedule_employee == userid && schedulestart >= datebegin && schedulestart < dateend) {
          this.checkScheduleOrder(userid, this.schedules[i], interval, ritual, officesel);
        }
      }
    }
  }

  getMasters(ritual, interval, officesel) {
    this.masters = [];
    this.checkedmasters1 = 0;
    this.checkedmasters2 = 0;
    return new Promise(resolve => {
      setTimeout(() => {
        this.database.executeSql("SELECT * FROM users WHERE user_work_pos>'1' AND (user_menue_exe LIKE '%,"+ritual+",%' OR user_menue_exe LIKE '"+ritual+",%' OR user_menue_exe LIKE '%,"+ritual+"' OR user_menue_exe = '"+ritual+"') AND user_del='0' ORDER BY user_id ASC", {})
        .then(suc => {
          if(suc.rows.length > 0) {

            this.masters.push({"in_id": 0,"user_city":null,"user_device_serial":null,"user_log":null,"user_pic":null,"user_reg":null,"user_menue_exe":"all","user_institution":this.institution,"user_del":0,"user_id":null,"user_email_confirm":null,"user_real_id":null,"user_name":"любой мастер","user_region":null,"user_pwd":null,"user_device_version":null,"user_upd":null,"user_conf_req":null,"user_middlename":"","user_country":null,"user_discount":null,"user_gender":null,"user_adress":null,"user_tel":null,"user_gcm":null,"user_log_key":null,"user_birthday":null,"user_mob":null,"user_info":null,"user_office":null,"user_install_where":null,"user_promo":null,"user_email":null,"user_device":null,"user_device_id":null,"user_surname":"","user_device_os":null,"user_work_pos":2,"user_mob_confirm":null,"user_work_time":[],"unixtime":[]});

            for(let i=0;i<suc.rows.length;i++) {
              
              suc.rows.item(i).in_id = i+1;
              suc.rows.item(i).user_work_time = [];
              suc.rows.item(i).unixtime = [];
              this.masters.push(suc.rows.item(i));

              if(i==suc.rows.length-1) {
                this.checkSchedule(suc.rows.item(i).user_real_id, interval, ritual, officesel);
                
                this.checkinterval = setInterval(() => {
                  if(this.checkedmasters1 == this.checkedmasters2) {
                    clearInterval(this.checkinterval);
                    this.checkWorkTimeForRandom().then(() => {
                      for(let p=0;p<this.masters.length;p++) {
                        this.masters[p].in_id = p;
                        if(p==this.masters.length-1) {
                          resolve(this.masters);
                        }
                      }
                    });
                  }
                  else {
                    this.checkedmasters2 = this.checkedmasters1;
                  }
                }, 1000);
              }
              else {
                this.checkSchedule(suc.rows.item(i).user_real_id, interval, ritual, officesel);
              }
            }
          }
        })
        .catch(er => {
          resolve(er);
        });
      }, 1000);
    });
  }

  // END OF - TAKE MASTER AND MASTER WORKTIME SECTION ---------------------------------

  getMaster(id) {
    return new Promise(resolve => {
      if(id > 0) {
        setTimeout(() => {
          let res = [];
          this.database.executeSql("SELECT * FROM users WHERE user_real_id='"+id+"' LIMIT 1", {})
          .then(suc => {
            if(suc.rows.length > 0) {
              for(let i=0;i<suc.rows.length;i++) {
                res.push(suc.rows.item(i));
              }
            }
            resolve(res);
          })
          .catch();
        }, 1000);
      }
      else {
        setTimeout(() => {
          let res = [{"in_id": 0,"user_city":null,"user_device_serial":null,"user_log":null,"user_pic":null,"user_reg":null,"user_menue_exe":"all","user_institution":this.institution,"user_del":0,"user_id":null,"user_email_confirm":null,"user_real_id":null,"user_name":"любой мастер","user_region":null,"user_pwd":null,"user_device_version":null,"user_upd":null,"user_conf_req":null,"user_middlename":"","user_country":null,"user_discount":null,"user_gender":null,"user_adress":null,"user_tel":null,"user_gcm":null,"user_log_key":null,"user_birthday":null,"user_mob":null,"user_info":null,"user_office":null,"user_install_where":null,"user_promo":null,"user_email":null,"user_device":null,"user_device_id":null,"user_surname":"","user_device_os":null,"user_work_pos":2,"user_mob_confirm":null,"user_work_time":[],"unixtime":[]}];
          resolve(res);
        }, 1000);
      }
    });
  }

  formatTime(x) {
    // ОПРЕДЕЛЕНИЕ ВРЕМЯ
    var nowtime: any = new Date(this.serverdate*1000);
    var gottime: any = this.timezoneAdd(x);
        gottime = gottime * 1000;
    // ПЕРЕВЕРНУТОЕ ВРЕМЯ, ТАК КАК ЗАПИСЬ В БУДУЩЕМ
    var nowtimediff = gottime - nowtime.getTime();
    var onltime = new Date(gottime);
    var onlDateTime;
    var onlMonth;
    var onlDay;
    var onlHour;
    var onlMin;
    var days = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
    var pushday1 = days[onltime.getDay()];

    // console.log('=================> '+nowtimediff + ' ' + nowtime.getTime() + ' ' + gottime)

    // DAYS AGO
    if(nowtimediff > 86400) {
      if(onltime.getMonth() < 9) {
          onlMonth = '0' + (onltime.getMonth() + 1);
      } else {
          onlMonth = onltime.getMonth() + 1;
      }

      if(onltime.getDate() < 10) {
          onlDay = '0' + onltime.getDate();
      } else {
          onlDay = onltime.getDate();
      }

      if(onltime.getHours() < 10) {
          onlHour = '0' + onltime.getHours();
      } else {
          onlHour = onltime.getHours();
      }
      if(onltime.getMinutes() < 10) {
          onlMin = '0' + onltime.getMinutes();
      } else {
          onlMin = onltime.getMinutes();
      }

      onlDateTime = pushday1 + ' ' + onlDay + '.' + onlMonth + '.' + onltime.getFullYear() + ' ' + onlHour + ':' + onlMin;
    }
    // HOURS AND MINUTES AGO
    else {
      if(onltime.getHours() < 10) {
          onlHour = '0' + onltime.getHours();
      } else {
          onlHour = onltime.getHours();
      }
      if(onltime.getMinutes() < 10) {
          onlMin = '0' + onltime.getMinutes();
      } else {
          onlMin = onltime.getMinutes();
      }

      onlDateTime =  onlHour + ':' + onlMin;
    }

    return onlDateTime;
  }

  // TIME TAKE FROM DB
  timezoneAdd(val) {
    let thetime = parseInt(val)*1000;
    let tzoff = new Date().getTimezoneOffset();
    let nsec = tzoff*60*1000;
    let serverzone = 3*60*60*1000;
    let timediff = nsec+serverzone;
    return ((thetime + timediff)/1000).toFixed(0);
  }

  // TIME SAVE TO DB OR TO SERVER
  timezoneSub(val) {
    let thetime = parseInt(val)*1000;
    let tzoff = new Date().getTimezoneOffset();
    let nsec = tzoff*60*1000;
    let serverzone = 3*60*60*1000;
    let timediff = nsec+serverzone;
    return ((thetime - timediff)/1000).toFixed(0);
  }

  decodeEntities(val) {
    let element = document.getElementById('htmlentitydecodediv');
    if(val && typeof val === 'string') {
      // strip script/html tags
      val = val.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      val = val.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = val;
      val = element.textContent;
      element.textContent = '';
    }
    return val;
  }

}
