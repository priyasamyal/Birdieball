import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl} from '@angular/forms';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { SingletonService } from '../../services/singleton/singleton';

import { LoginPage } from '../login/login';

import {CommonProvider} from '../../providers/common/common';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

     loginpage = LoginPage;   // variable for LoginPage
     
     data:any = {};
     
     signup;
     fullname;
     email;
     username;
     password;
     confirmPassword;
     
  constructor(public common:CommonProvider,public alertCtrl: AlertController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public http: Http, public singleton: SingletonService, public navCtrl: NavController) {
       
           // reset value
           this.fullname = '';
           this.email = '';
           this.username = '';
           this.password = '';
           this.confirmPassword = '';
           
           this.data.response = '';
           this.http = http;
          
           // form builder
           this.signup = formBuilder.group({
                  fullname: ['', Validators.compose([Validators.required])],
                  email: ['', Validators.compose([Validators.required])],
                  username: ['', Validators.compose([Validators.required])],
                  password: ['', Validators.compose([Validators.required])],
                  confirmPassword: ['', Validators.compose([Validators.required])]
           });
       
  }
 
     /**
     * Signup process.
     */
     signupFunc() {
      
          let email = this.singleton.emailPattern.test(this.email);
          let username = this.singleton.noSpaceWithAlphanumericUnderscoreOnlyPattern.test(this.username);
          
         // network check
         if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
         } else if(!this.fullname){
               this.singleton.commonToast('Please enter full name.');
         } else if(!this.username){
               this.singleton.commonToast('Please enter username.');
         } else if(!username){
               this.singleton.commonToast('Username can be alphanumeric including underscore only.');
         } else if(!this.email){
               this.singleton.commonToast('Please enter your email address.');
         } else if(!email){
               this.singleton.commonToast('Please enter valid email address.');
         } else if(!this.password){
               this.singleton.commonToast('Please enter password.');
         } else if(this.password.length<6){
               this.singleton.commonToast('Password must contain minimum 6 characters.');
         } else if(!this.confirmPassword){
               this.singleton.commonToast('Please confirm your password.');
         } else if(this.password !== this.confirmPassword){
               this.singleton.commonToast('Password does not match.');
         } else {
          
                
              
                var myData = JSON.stringify({
                         name: this.fullname, 
                         email: this.email,
                         username: this.username,
                         password: this.password,
                         confirm_password: this.confirmPassword
                    });
                    
                console.log("SIGNUP DATA:"+myData);     
                
         
                this.common.common_api(this.singleton.registerApi,'post',myData).then(data=>{
                  let callback;
                  callback =data;
                  this.singleton.commonToast('Successfully registered.');
                  this.navCtrl.push(this.loginpage);
                })
          }
           
      }
     

}
