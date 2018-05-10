import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { SelectSearchableModule } from 'ionic-select-searchable';

import { AutoCompleteModule } from 'ionic2-auto-complete';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Network } from '@ionic-native/network';

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';

import { SingletonService } from '../services/singleton/singleton';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SelectgamePage } from '../pages/selectgame/selectgame';
import { SelectplayerPage } from '../pages/selectplayer/selectplayer';
import { AddplayerPage } from '../pages/addplayer/addplayer';
import { GameplayPage } from '../pages/gameplay/gameplay';
import { Gamep4layPage } from '../pages/gamefour/gamefour';
import { Gamep3layPage } from '../pages/gamethree/gamethree';
import { Game1playPage } from '../pages/game/game';
import { ApiProvider } from '../providers/api/api';
import { CommonProvider } from '../providers/common/common';
import { ToastProvider } from '../providers/toast/toast';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    SelectgamePage,
    SelectplayerPage,
    AddplayerPage,
    GameplayPage,
       Gamep4layPage,
       Gamep3layPage,
       Game1playPage
    
  ],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    HttpModule, 
    SelectSearchableModule,  
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    SelectgamePage,
    SelectplayerPage,
    AddplayerPage,
    GameplayPage,
       Gamep4layPage,
       Gamep3layPage,
       Game1playPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SingletonService,
    Network,
    ImagePicker,
    Camera,   
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    CommonProvider,
    ToastProvider
  ]
})
export class AppModule {}
