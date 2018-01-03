import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { MyApp } from './app.component';
import { SuperTabsModule, SuperTabsController } from 'ionic2-super-tabs';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Keyboard } from '@ionic-native/keyboard';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HTTP } from '@ionic-native/http';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Push } from '@ionic-native/push';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TextMaskModule } from 'angular2-text-mask';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { SpaPage } from '../pages/spa/spa';
import { RitualPage } from '../pages/ritual/ritual';
import { ExpressPage } from '../pages/express/express';
import { HistoryPage } from '../pages/history/history';
import { ExpresschoicePage } from '../pages/expresschoice/expresschoice';
import { QrsummPage } from '../pages/qrsumm/qrsumm';
import { QrcodePage } from '../pages/qrcode/qrcode';
import { ReviewPage } from '../pages/review/review';
import { NewsPage } from '../pages/news/news';
import { NewsdetailPage } from '../pages/newsdetail/newsdetail';
import { TermsPage } from '../pages/terms/terms';
import { SharePage } from '../pages/share/share';
import { SharedetailsPage } from '../pages/sharedetails/sharedetails';
import { GiftsPage } from '../pages/gifts/gifts';
import { GiftsdetailPage } from '../pages/giftsdetail/giftsdetail';
import { ProfilePage } from '../pages/profile/profile';
import { ProfiledetailsPage } from '../pages/profiledetails/profiledetails';
import { SocialPage } from '../pages/social/social';
import { ServiceRitualsPage } from '../pages/service-rituals/service-rituals';
import { ServiceProgrammsPage } from '../pages/service-programms/service-programms';
import { ServiceGiftcardsPage } from '../pages/service-giftcards/service-giftcards';
import { ServiceDetailsPage } from '../pages/service-details/service-details';
import { SupportFaqPage } from '../pages/support-faq/support-faq';
import { SupportChatPage } from '../pages/support-chat/support-chat';
import { GroupsPage } from '../pages/groups/groups';
import { RitualchoicePage } from '../pages/ritualchoice/ritualchoice';
import { IntroPage } from '../pages/intro/intro';
import { ServiceGiftcardsDetailPage } from '../pages/service-giftcards-detail/service-giftcards-detail';
import { OrderedPage } from '../pages/ordered/ordered';
import { Ordered2Page } from '../pages/ordered2/ordered2';
import { SurveysPage } from '../pages/surveys/surveys';
import { OrdersPage } from '../pages/orders/orders';

import { TabsPage } from '../pages/tabs/tabs';

import { ModalritualsPage } from '../pages/modalrituals/modalrituals';
import { ModalmastersPage } from '../pages/modalmasters/modalmasters';

import { BackendProvider } from '../providers/backend/backend';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Ionic2RatingModule } from 'ionic2-rating';

import { TimepointsPipe } from '../pipes/timepoints/timepoints';
import { DatePipe } from '@angular/common';

import { FaIconComponent } from "../components/fa-icon/fa-icon.component";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    SpaPage,
    RitualPage,
    ExpressPage,
    HistoryPage,
    ExpresschoicePage,
    QrsummPage,
    QrcodePage,
    TabsPage,
    ReviewPage,
    NewsPage,
    NewsdetailPage,
    TermsPage,
    SharePage,
    SharedetailsPage,
    GiftsPage,
    GiftsdetailPage,
    ProfilePage,
    ProfiledetailsPage,
    SocialPage,
    ServiceRitualsPage,
    ServiceProgrammsPage,
    ServiceGiftcardsPage,
    ServiceDetailsPage,
    SupportFaqPage,
    SupportChatPage,
    GroupsPage,
    RitualchoicePage,
    IntroPage,
    ServiceGiftcardsDetailPage,
    OrderedPage,
    Ordered2Page,
    SurveysPage,
    OrdersPage,
    ModalritualsPage,
    ModalmastersPage,
    TimepointsPipe,
    FaIconComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      'backButtonText':'',
      'backButtonIcon':'arrow-back',
      ios: {
        scrollAssist: false, 
        autoFocusAssist: false,
        inputBlurring: false
      },
      monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
      monthShortNames: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
      dayNames: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
      dayShortNames: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
    }),
    SuperTabsModule,
    HttpModule,
    JsonpModule,
    NgxQRCodeModule,
    Ionic2RatingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCXpNcMG9kjvXRsU6C9-VDop7F6icGVmjM'
    }),
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    TextMaskModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    SpaPage,
    RitualPage,
    ExpressPage,
    HistoryPage,
    ExpresschoicePage,
    QrsummPage,
    QrcodePage,
    TabsPage,
    ReviewPage,
    NewsPage,
    NewsdetailPage,
    TermsPage,
    SharePage,
    SharedetailsPage,
    GiftsPage,
    GiftsdetailPage,
    ProfilePage,
    ProfiledetailsPage,
    SocialPage,
    ServiceRitualsPage,
    ServiceProgrammsPage,
    ServiceGiftcardsPage,
    ServiceDetailsPage,
    SupportFaqPage,
    SupportChatPage,
    GroupsPage,
    RitualchoicePage,
    IntroPage,
    ServiceGiftcardsDetailPage,
    OrderedPage,
    Ordered2Page,
    SurveysPage,
    OrdersPage,
    ModalritualsPage,
    ModalmastersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'ru-RU'},
    BackendProvider,
    SuperTabsController,
    BarcodeScanner,
    Keyboard,
    SQLite,
    Network,
    InAppBrowser,
    Device,
    HTTP,
    File,
    FileTransfer,
    Push,
    TimepointsPipe,
    DatePipe,
    SocialSharing,
    Camera,
    ImagePicker
  ]
})
export class AppModule {}
