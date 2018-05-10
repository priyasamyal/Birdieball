import {Injectable} from '@angular/core';
import {Platform, Events, LoadingController, AlertController, ToastController, ActionSheetController} from 'ionic-angular';
import {ValidatorFn, AbstractControl } from '@angular/forms';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';    

@Injectable()
export class SingletonService {

    public versionString: string = "1.0.0";  // version
    public loginState: boolean = false;      // user logged in
    public emailPattern = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;    // email validation regex
    public noSpaceWithCharacterOnlyPattern = /^[a-zA-Z]*$/; // character without space validation regex
    public numberOnlyPattern = /^\d+$/;      // number validation regex
    public mobileNumberOnlyPattern = /^\d{10}$/;  // mobile number validation regex
    public noSpaceWithAlphanumericUnderscoreOnlyPattern = /^[a-zA-Z0-9_]+$/;    // alpha numeric without space validation regex
   
    public iOSappUrl = ''; // app store url

    public webDomain: string = "https://www.prologic-technologies.com/demo/birdieball/";  // domain
    public domain: string = this.webDomain + 'api/mobile/';      // api domain
    public baseUrl: string =  this.domain + 'user/';   // user api domain
    public saveProfileImageApi: string = this.baseUrl + 'saveProfileImage/';    // save profile image api
    public commonDetailsApi: string = this.baseUrl + 'projectDetail/';     // get common details api
    public loginApi: string = this.baseUrl + 'login/'; // login api
    public registerApi: string = this.baseUrl + 'register/';     // signup api
    public forgotPasswordApi: string = this.baseUrl + 'forgotPassword/';   // forgot password api
    public userProfileApi: string = this.baseUrl + 'userDetails/';    // user details api
    public changePasswordApi: string = this.baseUrl + 'changePassword/';   // change password api
    public viewLeaderboardApi: string = this.baseUrl + 'leaderBoard/';     // get leader board details api
    public postSelectGameApi: string = this.baseUrl + 'selectedGame/';     // save selected game and its details
    public updateCurrentGameScoreApi: string = this.baseUrl + 'updateScores/';  // update score of current game playing
    public getPreviousRoundScoreApi: string = this.baseUrl + 'getPreviousScore/';  // get score of previous round playing
    public getGameScoreApi: string = this.baseUrl + 'gameScoreBoard/';  // update score of current game playing
    
    // basic game details
    public gamesObj = {"game_1":{"game_id":1,"title":"ROAD GAME Original","description":"The object of the game is to complete what is known as a hole by playing a ball from the teeing ground into the hole on the putting green in the fewest possible number of strokes. A \"round of golf\" consists of playing 18 such holes."},"game_2":{"game_id":2,"title":"ROAD GAME AIM","description":"The Definitions section of the Rules of Golf contains over forty Definitions which form the foundation around which the Rules of play are written."},"game_3":{"game_id":3,"title":"ROAD GAME 3","description":["Don't move, talk or stand close to a player making a stroke.","Don't play until the group in front is out of the way.","Always play without delay.","Invite faster groups to play through."]},"game_4":{"game_id":4,"title":"ROAD GAME 4","description":"The object of the game is to complete what is known as a hole by playing a ball from the teeing ground into the hole on the putting green in the fewest possible .\u0003Don't play until the group in front is out of the way."}};
     
    public sessionExpiredMsg = "Your session has been expired. Please login again to continue.";
    public jwtStringErrorMsg = "The JWT string must have two dots";
     
    public activeUsers;  // active users array
    public allActiveUsers;    // all active users array
    public tempActiveUsers;   // temp active users array
    public privacyPolicy;     // privacy policy link
    public username;     // username
    public userEmail;    // user email id
     
    public gamerTypeObj;      // not in use
    public selectGameObj;     // create object with game details
    public addPlayerObj;      // create object with player details
     
    isPlaying : boolean = true;    // background music is playing
    isUserLoggedIn : boolean = false;   // user is logged in
     
    public playerMode = '';       // Player mode (single or multi)
    public loader;       // loader
     
    public pauseModal = false; 
    public helpModal = false;
    public scoreBoardModal = false;
    public leaderBoardModal = false;
    public myAccountModal = false;
    public privacyModal = false;
    public contactUsModal = false;
    public settingsModal = false;
     
    data:any = {};
   
    constructor( public events: Events, public platform: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, public actionsheetCtrl: ActionSheetController, public http: Http, public network: Network) {
        // initalize things
        this.data.response = '';
        this.http = http;
    }
    
     /**
     * Close all modal
     */
    modalCloseFun() {
          this.pauseModal = false;
          this.helpModal = false;
         
          this.scoreBoardModal = false;
          this.leaderBoardModal = false;
          this.myAccountModal = false;
          this.privacyModal = false;
          this.contactUsModal = false;
          this.settingsModal = false;
    }
     
    // Create & Show loader
    showLoader() {
          this.loader = this.loadingCtrl.create({
               content: 'Please wait...',    // text
               spinner: 'circles'  // dots, ios, ios-small, bubbles, circles, crescent
          });
          this.loader.present();
    }
    
    // Hide loader
    hideLoader() {
        if(this.loader){
               this.loader.dismiss();
               this.loader = null;
        }
    }
    
    // Create & Show alert
     doAlert(title:string, message:string, button:string) {
         let alert = this.alertCtrl.create({
           title: title, // title
           message: message,  // message
           buttons: [button]  // button text
         });
         alert.present();     // show alert dialog
     }

     // Create & Show confirm dialog
     doConfirm(title:string, message:string, buttonOne:string, buttonTwo:string) {
         let confirm = this.alertCtrl.create({
           title: title, // title
           message: message,  // message
           buttons: [
             {
               text: buttonOne,    // button one text
               handler: () => {
                 console.log('Agree clicked');
               }
             },
             {
               text: buttonTwo,    // button two text
               handler: () => {
                 console.log('Disagree clicked');
               }
             }
           ]
         });
         confirm.present();   // show confirm dialog
     }
     
     // Create & Show toast
     showToast(position: string, message:string, duration:number, closeButton:boolean, closeButtonText:string) {
         let toast = this.toastCtrl.create({
           message: message,  // message
           duration: duration,     // duration
           position: position,     // position
           showCloseButton: closeButton,     // close button
           closeButtonText: closeButtonText, // close button text
           dismissOnPageChange : false  // hide on page change
         });
         toast.present(toast);     // show toast
       }
       
       commonToast(message:string) {
         let toast = this.toastCtrl.create({
           message: message,  // message
           duration: 3000,    // duration
           position: 'bottom',     // position bottom of the screen
           showCloseButton: false, // do not show close button
           dismissOnPageChange : false  // hide on page change
         });
         toast.present(toast);     // show toast
       }
       
     // open link in system/device browser
       launch(url) {
             this.platform.ready().then(() => {
                 window.open(url, '_system');
             });
         }

     /**
     * Network/Internet check
     */
     networkCheck(){
          console.log("NETWORK TYPE:" + this.network.type);
          if(this.network.type == 'NONE' || this.network.type == 'none'){
               return false;
          } else {
               return true;
          }
     }
       
     /**
     * One field equal to other field
     */
     equaltoFunc(field_name): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;

               let isValid = control.root.value[field_name] == input;
               //console.log("PASSWORD:"+control.value+"|"+isValid);
               if(!isValid) 
               return { 'equalToKey': {isValid} }
               else 
               return null;
          };
     }
     
     /**
     * Validate email id
     */
     validateEmailFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let emailTest = this.emailPattern.test(input);
               //console.log("EMAIL:"+input+"|"+emailTest);
               if(!emailTest)
               return { 'validateEmailKey': {emailTest} }
               else 
               return null;
          };
     }
     
     /**
     * Characters are allowed without spaces
     */
     noSpaceWithCharacterOnlyFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let noSpaceCharacterOnlyPattern = /^[a-zA-Z]*$/;
               let noSpaceCharacterOnlyTest = noSpaceCharacterOnlyPattern.test(input);
               //console.log("CHARACTER ONLY WITHOUT SPACE:"+input+"|"+noSpaceCharacterOnlyTest);
               if(!noSpaceCharacterOnlyTest)
               return { 'noSpaceCharacterOnlyKey': {noSpaceCharacterOnlyTest} }
               else 
               return null;
          };
     }
     
     /**
     * Characters and Numbers are allowed without spaces
     */
     noSpaceWithAlphanumericUnderscoreOnlyFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let noSpaceWithAlphanumericUnderscoreOnlyTest = this.noSpaceWithAlphanumericUnderscoreOnlyPattern.test(input);
               //console.log("ALPHANUMERIC UNDERSCORE WITHOUT SPACE:"+input+"|"+noSpaceWithAlphanumericUnderscoreOnlyTest);
               if(!noSpaceWithAlphanumericUnderscoreOnlyTest)
               return { 'noSpaceAlphanumericUnerscoreOnlyKey': {noSpaceWithAlphanumericUnderscoreOnlyTest} }
               else 
               return null;
          };
     }
     
     /**
     * Only numbers are allowed
     */
     numberOnlyFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let numberOnlyTest = this.numberOnlyPattern.test(input);
               //console.log("NUMBER ONLY:"+input+"|"+numberOnlyTest);
               if(!numberOnlyTest)
               return { 'numberOnlyKey': {numberOnlyTest} }
               else 
               return null;
          };
     }
     
     /**
     * Characters are allowed with space
     */
     characterOnlyWithSpaceFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let characterOnlyWithSpacePattern = /^[a-zA-Z ]*$/;
               let characterOnlyWithSpaceTest = characterOnlyWithSpacePattern.test(input);
               //console.log("CHARACTER ONLY:"+input+"|"+characterOnlyWithSpaceTest);
               if(!characterOnlyWithSpaceTest)
               return { 'characterOnlyWithSpaceKey': {characterOnlyWithSpaceTest} }
               else 
               return null;
          };
     }
     
     /**
     * Get object based on value
     */
     getObjectBasedOnValueFunc(arr, key, value){
           var selectedCategory = arr.find(item => item[key] == value);
           console.log("SPECIFIC ITEM:"+JSON.stringify(selectedCategory));
           return selectedCategory;
     }
     
     /**
     * Clear local and session storage on logout
     */
     logoutFunc(){
          this.isUserLoggedIn = false;
          let username=window.localStorage.getItem('name');
          let is_remember=window.localStorage.getItem('logged')
          window.localStorage.clear();
          window.sessionStorage.clear();
          if(is_remember!=null){
            window.localStorage.setItem('tempUserName',username);
          }else{
            window.localStorage.clear();
            window.sessionStorage.clear();
          }
        
          this.getCommonDetail();
     }
     
     /**
     * Compare current and previous version
     */
     versionCompare(a, b) {
         if (a === b) {
            return 0;
         }

         var a_components = a.split(".");
         var b_components = b.split(".");

         var len = Math.min(a_components.length, b_components.length);

         // loop while the components are equal
         for (var i = 0; i < len; i++) {
             // A bigger than B
             if (parseInt(a_components[i]) > parseInt(b_components[i])) {
                 return 1;
             }

             // B bigger than A
             if (parseInt(a_components[i]) < parseInt(b_components[i])) {
                 return -1;
             }
         }

         // If one's a prefix of the other, the longer one is greater.
         if (a_components.length > b_components.length) {
             return 1;
         }

         if (a_components.length < b_components.length) {
             return -1;
         }

         // Otherwise they are the same.
         return 0;
     }

     /**
     * Get common details of project
     */
     getCommonDetail(){
          
          if(!this.networkCheck()) {
               this.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {          
               this.http.get(this.commonDetailsApi)
                     .subscribe(data => {
                         this.data.response = data["_body"]; 
                         var callback = JSON.parse(this.data.response);
                        // console.log(JSON.stringify(callback)+"\n"+this.versionString);

                         if(callback.meta.success){
                              
                              this.isUserLoggedIn = (window.localStorage.getItem('userId')) ? true : false;
                              
                              this.tempActiveUsers = callback.data.active_users;
                              this.allActiveUsers = callback.data.active_users;
                              this.activeUsers = callback.data.active_users;
                              this.gamesObj = callback.data.games;
                              this.privacyPolicy = callback.data.privacy_policy;
                              
                              for(let data of this.tempActiveUsers) {
                                   data["is_visible"] = true;
                              }
                              
                              window.localStorage.setItem("allActiveUsers", JSON.stringify(this.allActiveUsers));
                              
                              var loggedInUser = this.getObjectBasedOnValueFunc(this.activeUsers, "user_id", window.localStorage.getItem('userId'));
                              
                              this.tempActiveUsers = this.tempActiveUsers.filter(obj => obj !== loggedInUser);
                              this.activeUsers = this.tempActiveUsers.filter(obj => obj !== loggedInUser);
                              
                         } else {

                              if (callback.data.errors.type == 'validation') {
                                   var validationErrors = "";

                                   // create a single string from validation array.
                                   for (var propName in callback.data.errors.array) {
                                        if (callback.data.errors.array.hasOwnProperty(propName)) {
                                             validationErrors += callback.data.errors.array[propName] + "<br>";
                                        }
                                   }
                                   this.doAlert('', validationErrors, 'Ok');
                              } else {
                                   this.commonToast(callback.data.errors.message);
                              }
                         }
                     }, error => {
                         console.log("Oooops!"+JSON.stringify(error));
                     });
          }
      }
     
     /**
     * Get number ordinal value
     */
     getOrdinal(n) {
        var s=["th","st","nd","rd"],
        v=n%100;
        return n+(s[(v-20)%10]||s[v]||s[0]);
     }

     /**
     * Check variable whether it is url or not.
     */
     validURL(str) {
       var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
       if(!regex .test(str)) {
         return false;
       } else {
         return true;
       }
     }
     
     /**
     * Integer to word conversion
     */
     numberToEnglish(n, custom_join_character) {

         var string = n.toString(),
             units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

         //var and = custom_join_character || 'and';
         var and = '';

         /* Is number zero? */
         if (parseInt(string) === 0) {
             return 'zero';
         }

         /* Array of units as words */
         units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

         /* Array of tens as words */
         tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

         /* Array of scales as words */
         scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

         /* Split user arguemnt into 3 digit chunks from right to left */
         start = string.length;
         chunks = [];
         while (start > 0) {
             end = start;
             chunks.push(string.slice((start = Math.max(0, start - 3)), end));
         }

         /* Check if function has enough scale words to be able to stringify the user argument */
         chunksLen = chunks.length;
         if (chunksLen > scales.length) {
             return '';
         }

         /* Stringify each integer in each chunk */
         words = [];
         for (i = 0; i < chunksLen; i++) {

             chunk = parseInt(chunks[i]);

             if (chunk) {

                 /* Split chunk into array of individual integers */
                 ints = chunks[i].split('').reverse().map(parseFloat);

                 /* If tens integer is 1, i.e. 10, then add 10 to units integer */
                 if (ints[1] === 1) {
                     ints[0] += 10;
                 }

                 /* Add scale word if chunk is not zero and array item exists */
                 if ((word = scales[i])) {
                     words.push(word);
                 }

                 /* Add unit word if array item exists */
                 if ((word = units[ints[0]])) {
                     words.push(word);
                 }

                 /* Add tens word if array item exists */
                 if ((word = tens[ints[1]])) {
                     words.push(word);
                 }

                 /* Add 'and' string after units or tens integer if: */
                 if (ints[0] || ints[1]) {

                     /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                     if (ints[2] || !i && chunksLen) {
                         words.push(and);
                     }

                 }

                 /* Add hundreds word if array item exists */
                 if ((word = units[ints[2]])) {
                     words.push(word + ' hundred');
                 }

             }

         }
          console.log(words.reverse());
          return words[1];
          //return words.reverse().join(' ');
     }
     
     ajaxSuccessFailHandler(callback){
          
          if (callback.data.errors.type == 'validation') {
               var validationErrors = "";
               for (var propName in callback.data.errors.array) {
                    if (callback.data.errors.array.hasOwnProperty(propName)) {
                         validationErrors += callback.data.errors.array[propName] + "<br>";
                    }
               }
               this.doAlert('', validationErrors, 'Ok');
          } else {
               this.commonToast(callback.data.errors.message);
               
               if(callback.data.errors.message == this.sessionExpiredMsg || callback.data.errors.message == this.jwtStringErrorMsg){
                    this.logoutFunc();
                    this.events.publish('session:expired');
               }
          }
     }
     
     /**
     * Check key exist
     */
     checkKey(obj, key) {
         if(key in obj){
             return obj[key];
         }
         else{
             for (var k in obj){
                 var t = obj[k]
                 if(typeof t === "object" && !Array.isArray(t) && t !== null){
                     return this.checkKey(t, key);    
                 }
             }
         }
         return false;
     }
     
     /**
     * Get index of object
     */     
     indexOfObj(obj, key){
          for(var i = 0; i < obj.length;i++) {
               if(obj[i][key]){
//                    console.log("FINAL"+JSON.stringify(obj[i][key]));
                    return obj[i][key];
               }
          }
          return false;
     }


     
}


