import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, Events, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';
//import { Router } from '@angular/router';

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { SingletonService } from '../services/singleton/singleton';

//Import pages
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SelectgamePage } from '../pages/selectgame/selectgame';
import { AddplayerPage } from '../pages/addplayer/addplayer';

import { GameplayPage } from '../pages/gameplay/gameplay';
import { Gamep4layPage } from '../pages/gamefour/gamefour';
import { Gamep3layPage } from '../pages/gamethree/gamethree';
import { Game1playPage } from '../pages/game/game';
import {CommonProvider} from '../providers/common/common';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
     @ViewChild(Nav) nav: Nav;
 // rootPage:any = SelectgamePage;
     
  selectGamePage = SelectgamePage;
  loginpage = LoginPage;
     
  rootPage:any;
     
  public online:boolean = false;
     
  public options;
     
  data:any = {};  
     
  backButtonPressedOnceToExit;
     
  constructor(public commmon: CommonProvider,private network: Network, public events: Events, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public singleton: SingletonService, public http: Http, public imagePicker: ImagePicker, public camera: Camera, public alertCtrl: AlertController) {
       
    platform.ready().then(() => {
      console.log("platform called")
     // statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#004d40");     
    });
              this.http = http;
       
              this.initializeApp();
          
              this.network.onConnect().subscribe(res=>{
                this.online = true;
                console.log("NETWORK STATUS:" + this.online);
              });
       
              this.network.onConnect().subscribe(() => {
                   console.log("Connected successfully")         
                   //do other tasks after connected
              }, error => console.error(error));

              this.network.onDisconnect().subscribe(res=>{
                this.online = false;
                console.log("NETWORK STATUS:" + this.online);
                this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');    
              });
       
              // login check
               if(window.localStorage.getItem('logged') == 'true'){
                    this.singleton.username = window.localStorage.getItem('username');
                    this.singleton.userEmail = window.localStorage.getItem('userEmail');
                    
                    this.rootPage = SelectgamePage;
               } else {
                 this.rootPage = LoginPage;
                 // this.rootPage=AddplayerPage
               }
               this.singleton.getCommonDetail();
       
               events.subscribe('session:expired', () => {
                    this.nav.setRoot(this.loginpage);
               });
   
  }
     
     mainMenuFunc() {
      console.log("mainMenuFunc")
      window.sessionStorage.setItem('exitConfirm', 'true');
      this.commmon.showPromptOk('Warning', 'Are you sure you want to exit this game.',  (res) => {
        console.log("callback called",res)
        if(res=='yes'){
          console.log('Agree clicked');
          window.sessionStorage.setItem('isGamePage', '');
          window.sessionStorage.setItem('exitConfirm', 'false');
          this.nav.setRoot(this.selectGamePage);
        }else{
          window.sessionStorage.setItem('exitConfirm', 'false');     
          console.log('Disagree clicked');
        }

  })
       
          
     }
     
     initializeApp() {
          
         this.platform.ready().then(() => {
           // Okay, so the platform is ready and our plugins are available.
           // Here you can do any higher level native things you might need.
          // this.statusBar.styleDefault();
           this.splashScreen.hide();
              
           this.platform.resume.subscribe((e) => {
             console.trace("resume called"); 
           });

           this.platform.pause.subscribe((e) => {
             console.trace("pause called"); 
             this.singleton.pauseModal = true; 
           });    
              
           this.platform.registerBackButtonAction(() => {

                let currentUrl = window.sessionStorage.getItem('isGamePage');
                console.log("currentUrl:" + currentUrl);
                
                //uncomment this and comment code below to to show toast and exit app
                if(this.singleton.scoreBoardModal) {
                     this.singleton.modalCloseFun();
                     this.nav.setRoot(this.selectGamePage);
                } else if(this.singleton.pauseModal || this.singleton.helpModal || this.singleton.scoreBoardModal || this.singleton.leaderBoardModal || this.singleton.myAccountModal || this.singleton.privacyModal || this.singleton.contactUsModal || this.singleton.settingsModal) {
                     this.singleton.modalCloseFun();
                } else if(currentUrl == 'true' && window.sessionStorage.getItem('exitConfirm') != 'true') {
                     this.mainMenuFunc();
                } else if(window.sessionStorage.getItem('exitConfirm') != 'true'){
                     if (this.backButtonPressedOnceToExit) {
                        this.platform.exitApp();
                      } else if (this.nav.canGoBack()) {
                        this.nav.pop({});
                      } else {
                        this.backButtonPressedOnceToExit = true;
                        this.singleton.commonToast('Click back button twice to exit.');  
                        setTimeout(() => {
                              this.backButtonPressedOnceToExit = false;
                        }, 2000)
                      }
                }

              });    
         });    
       }
     
}