import { Component } from '@angular/core';
import { NavController, AlertController,IonicPage ,NavParams} from 'ionic-angular';
import { Http } from '@angular/http';
import { FormBuilder, Validators} from '@angular/forms';

import { SingletonService } from '../../services/singleton/singleton';

import { SignupPage } from '../signup/signup';
//import { SelectplayerPage } from '../selectplayer/selectplayer';
import { SelectgamePage } from '../selectgame/selectgame';
import {CommonProvider} from '../../providers/common/common';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
     
  data:any = {};
  login;
  obj;
  signupPage = SignupPage;
  selectGamePage = SelectgamePage;
  isChecked:boolean=false;
  username;
  password;
  rememberMe: boolean = false;
     
  constructor(public navparams:NavParams, public common:CommonProvider,public alertCtrl: AlertController, public http: Http, public singleton: SingletonService, public navCtrl: NavController, public formBuilder: FormBuilder) {
       this.username = '';
       this.password = '';
       this.http = http;

       this.login = formBuilder.group({
              username: ['', Validators.compose([Validators.required])],
              password: ['', Validators.compose([Validators.required])]
       });
       console.log(window.localStorage.getItem('tempUserName'),"is remember");
       if(window.localStorage.getItem('tempUserName')!=null){
         this.isChecked=true;
        this.username=window.localStorage.getItem('tempUserName');
       }

       
  }
 
       /**
       * Forgot password
       */
       forgotPasswordPrompt() {
         let prompt = this.alertCtrl.create({
           title: 'Forgot Password',
           inputs: [
             {
               name: 'email',
               placeholder: 'Enter email address'
             },
           ],
           buttons: [
             {
               text: 'Cancel',
               handler: data => {
                 console.log('Cancel clicked');
               }
             },
             {
               text: 'Submit',
               handler: data => {
                    
                        let validateObj = this.singleton.emailPattern.test(data.email);
                        
                        // network check
                        if(!this.singleton.networkCheck()) {
                              this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
                        } else if (!validateObj) {
                            this.singleton.commonToast('Please enter valid email address');
                            return false;
                        } else {
                         
                           /**Call Forgot Password api */
                            var myData = JSON.stringify({email: data.email});
                            this.common.common_api(this.singleton.forgotPasswordApi,'post',myData).then(data=>{
                              let callback;
                              callback =data;
                              this.singleton.commonToast(callback.data.message);
                              prompt.dismiss();
                               
                           })
                        
                               return false;
                        }
               }
             }
           ]
         });
         prompt.present();
     } 
     
     checked : boolean = false;
     
     /**
     * Set checked
     */
     addValue(e:any){
          this.checked = e.checked;
     }
     
     /**
     * Login process
     */
     loginFunc() {

          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else if(!this.username) {
               this.singleton.commonToast('Please enter username or email');
          } else if(!this.password) {
               this.singleton.commonToast('Please enter password');
          } else {
               
             
                var myData = JSON.stringify({username: this.username, password: this.password});
                this.common.common_api(this.singleton.loginApi,'post',myData).then(data=>{
                console.log(data,"response");
                let callback;
                callback =data;
                  
                         
                     if(this.checked){
                            window.localStorage.setItem('logged', 'true');
                         }
                         
                         this.singleton.isUserLoggedIn = true;
                         
                         window.localStorage.setItem('userId', callback.data.user_id);
                         window.localStorage.setItem('name', callback.data.name);
                         window.localStorage.setItem('username', callback.data.username);
                         window.localStorage.setItem('userEmail', callback.data.email);
                         window.localStorage.setItem('userProfilePicture', callback.data.profile_image);
                         
                         var loggedInUser = this.singleton.getObjectBasedOnValueFunc(this.singleton.activeUsers, "user_id", window.localStorage.getItem('userId'));
                         this.singleton.tempActiveUsers = this.singleton.tempActiveUsers.filter(obj => obj !== loggedInUser);
                         this.singleton.activeUsers = this.singleton.tempActiveUsers.filter(obj => obj !== loggedInUser);
                         
                         this.singleton.commonToast('Successfully logged-in');
                         this.navCtrl.setRoot(this.selectGamePage);
                         
                         this.singleton.getCommonDetail();
                    
                }
                )

              
          }
           
      }
     
     /**
     * Offline mode
     */
     offlineModeFunc() {
          this.singleton.logoutFunc();
          this.navCtrl.push(this.selectGamePage,{'isoffline':true});
     }

    

}
