import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SingletonService } from '../../services/singleton/singleton';

import { SelectgamePage } from '../selectgame/selectgame';

@Component({
  selector: 'page-gameplay3',
  templateUrl: 'gamefour.html'
})
export class Gamep4layPage {

     selectGamePage = SelectgamePage;

     scoreArray;
     tempArray;
     scoreboardArray;
     
     data:any = {}; 
     
     activeShot = 1;
     
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public singleton: SingletonService, public http: Http) {
       this.http = http;
  }
     
     /**
     * Run function when page launch and set default score, name and users playing this game
     */
     ngAfterViewInit() {
          
               // reset score array
               this.scoreArray = [];
               // push username and total score object in score array
               for(var i = 0; i < this.singleton.selectGameObj.user_id.length; i++) {
                    var currentUser = this.singleton.getObjectBasedOnValueFunc(this.singleton.allActiveUsers, "user_id", this.singleton.selectGameObj.user_id[i]);
                    this.scoreArray.push({"username" : currentUser.username, "total_score" : 0});
               }

               this.singleton.selectGameObj["score_array"] = this.scoreArray;

               console.log(this.singleton.selectGameObj);

               // set first player username 
               document.getElementById('currentPlayerName').textContent = this.singleton.selectGameObj.score_array[0].username;
               // set score
               document.getElementById('currentPlayerScore').textContent = ' 0';
               // set round
               document.getElementById('currentRound').textContent = '01';

               // create temp array
               this.tempArray = {
                    "gameId": this.singleton.selectGameObj.game_id,
                    "roundId": this.singleton.selectGameObj.round_id,
                    "userId": this.singleton.selectGameObj.user_id[0],
                    "username": this.singleton.selectGameObj.score_array[0].username,
                    "currentRound" : 1,
                    "is_last_shot" : 0,
                    "shots" : {
                         "one" : "null",
                         "two" : "null",
                         "three" : "null"
                    }
               }
               
     }

     /**
     * Open pause modal and check sound is enable or not.
     */
     pauseModalOpenFun() {
          this.singleton.modalCloseFun();
          this.singleton.pauseModal = true;
          
          var mThis = this;
          setTimeout(function(){
               mThis.soundCheck();
          }, 100);
     }

     /**
     * Open help modal.
     */
     helpModalOpenFun() {
          this.singleton.modalCloseFun();
          this.singleton.helpModal = true;
     }

     /**
     * Sound check whether it is enabled or not and based on that change icon/image
     */
     soundCheck() {
          var soundImage = <HTMLImageElement>document.getElementById("soundImage");
          
          if (!window.localStorage.getItem('sound') || window.localStorage.getItem('sound') == 'true') {
              soundImage.src = "assets/imgs/music.png";
          } else if(window.localStorage.getItem('sound') == 'false') {
              soundImage.src = "assets/imgs/sound_off.png";
          }
     }
     
     /**
     * Go back to select game page and close modal.
     */
     backToSelectGamePageFunc() {
          this.singleton.modalCloseFun();
          window.sessionStorage.setItem('isGamePage', '');
          this.navCtrl.setRoot(this.selectGamePage);
     }
     
     /**
     * Show a confirmation pop-up to exit this current game.
     */
     mainMenuFunc() {
          
          let confirm = this.alertCtrl.create({
           title: "Warning",
           message: "Are you sure you want to exit this game.",
           buttons: [
             {
               text: "YES",
               handler: () => {
                   console.log('Agree clicked');
                   this.backToSelectGamePageFunc();
               }
             },
             {
               text: "NO",
               handler: () => {
                 console.log('Disagree clicked');
               }
             }
           ]
         });
         confirm.present();
     }
     
     /**
     * Set score of current shot.
     */
     scorePointFunc(selectedScore) {
          
          console.log("TEMPARR1"+JSON.stringify(this.tempArray)+"|"+selectedScore);

          var shotIndex, isLastShot = 0;

          if(this.activeShot == 0){
               
               this.singleton.commonToast("Please select the shot first to proceed to score.");  
               
          } else {
               
               if(this.tempArray.is_last_shot == 1 && (this.tempArray.shots.one != "null" && this.tempArray.shots.two != "null") || (this.tempArray.shots.one != "null" &&  this.tempArray.shots.three != "null") || (this.tempArray.shots.three != "null" && this.tempArray.shots.two != "null")){
                    isLastShot = this.tempArray.is_last_shot; 
               }
               
                    // create object to send it to the server
                     var currentPlayerScoreObj = {
                            "user_id" : this.tempArray.userId,
                            "game_id" : this.tempArray.gameId,
                            "round_id" : this.tempArray.roundId,
                            "shot_point" : selectedScore,
                            "shot" : this.activeShot,
                            "round_number": this.tempArray.currentRound,
                            "is_last_shot" : isLastShot
                    };

                     // show loader
                     this.singleton.showLoader();

                     var myData = JSON.stringify(currentPlayerScoreObj);
                     console.log("MYDATA:" + myData);

                     this.http.post(this.singleton.updateCurrentGameScoreApi, myData)
                     .subscribe(data => {
                         this.data.response = data["_body"]; 
                         var callback = JSON.parse(this.data.response);
                         console.log(JSON.stringify(this.data));

                         this.singleton.hideLoader();
                         if(callback.meta.success) {
                              
                              if(currentPlayerScoreObj.is_last_shot == 1){
                                   
                                   this.scoreArray = [];
                                   document.getElementById('currentPlayerName').textContent = '';
                                   document.getElementById('currentPlayerScore').textContent = '';
                                   document.getElementById('currentRound').textContent = '01';
                                   document.getElementById('shotOneScore').textContent = '';
                                   document.getElementById('shotTwoScore').textContent = '';
                                   document.getElementById('shotThreeScore').textContent = '';

                                   this.singleton.scoreBoardModal = true;

                                   this.scoreboardArray = callback.data.result_list;

                              } else {

                                   this.scoreArray = callback.data.others_details;

                                   document.getElementById('currentPlayerName').textContent = callback.data.my_details.username;
                                   document.getElementById('currentPlayerScore').textContent = callback.data.my_details.total_score;
                                   document.getElementById('shotOneScore').textContent = callback.data.my_details.shot_point_1;
                                   document.getElementById('shotTwoScore').textContent = callback.data.my_details.shot_point_2;
                                   document.getElementById('shotThreeScore').textContent = callback.data.my_details.shot_point_3;

                                   var nextUserId = callback.data.my_details.user_id, nextUsername = callback.data.my_details.username, defaultScore = "null", currentRoundNumber = callback.data.my_details.round_number, isLastShot = 0;
                                   //callback.data.my_details.shot_point_3 != '0'
                                   
                                   this.activeShot = this.activeShot + 1;
                                   
                                   if(callback.data.my_details.shot_point_1 && callback.data.my_details.shot_point_2 && callback.data.my_details.shot_point_3) {

                                        var userIndex = this.singleton.selectGameObj.user_id.indexOf(callback.data.my_details.user_id);
                                        userIndex = userIndex + 1;
                                        
                                        this.activeShot = 1;
                                        if(userIndex == this.singleton.selectGameObj.user_id.length) {
                                             userIndex = 0;
                                             currentRoundNumber = parseInt(currentRoundNumber) + 1;
                                        }

                                        nextUserId = this.singleton.selectGameObj.user_id[userIndex];
                                        nextUsername = this.singleton.selectGameObj.score_array[userIndex].username;

                                        callback.data.my_details.shot_point_1 = defaultScore;
                                        callback.data.my_details.shot_point_2 = defaultScore;
                                        callback.data.my_details.shot_point_3 = defaultScore;

                                        var roundNumber = (currentRoundNumber < 10) ? '0' + currentRoundNumber : currentRoundNumber;

                                        document.getElementById('currentPlayerName').textContent = nextUsername;
                                        document.getElementById('currentPlayerScore').textContent = ' 0';
                                        document.getElementById('currentRound').textContent = roundNumber;
                                        document.getElementById('shotOneScore').textContent = '';
                                        document.getElementById('shotTwoScore').textContent = '';
                                        document.getElementById('shotThreeScore').textContent = '';
                                   }

                                   var tempUserIndex = this.singleton.selectGameObj.user_id.indexOf(callback.data.my_details.user_id);
                                   tempUserIndex = tempUserIndex + 1;
                                   
                                   if(currentRoundNumber == this.singleton.selectGameObj.game_rounds && callback.data.my_details.shot_point_2 && tempUserIndex == this.singleton.selectGameObj.user_id.length){
                                        isLastShot = 1;
                                   }

                                   this.tempArray = {
                                        "gameId": this.singleton.selectGameObj.game_id,
                                        "roundId": this.singleton.selectGameObj.round_id,
                                        "userId": nextUserId,
                                        "username": nextUsername,
                                        "currentRound" : currentRoundNumber,
                                        "is_last_shot" : isLastShot,
                                        "shots" : {
                                             "one" : callback.data.my_details.shot_point_1 ? callback.data.my_details.shot_point_1 : defaultScore,
                                             "two" : callback.data.my_details.shot_point_2 ? callback.data.my_details.shot_point_2 : defaultScore,
                                             "three" : callback.data.my_details.shot_point_3 ? callback.data.my_details.shot_point_3 : defaultScore
                                        }
                                   }
                                   console.log("TEMPARR2"+JSON.stringify(this.tempArray)+"|"+this.activeShot);

                              }

                         } else {
                              this.singleton.ajaxSuccessFailHandler(callback);
                         }
                         
                     }, error => {
                         console.log("Oooops!" + JSON.stringify(error));
                         this.singleton.hideLoader();
                     });
               }

     }
     
     /**
     * Check if any shot is active or not.
     */
     activeShotCheck(shot){
          
          var shotA = document.getElementById('shotOneScore').textContent;
          var shotB = document.getElementById('shotTwoScore').textContent;
          var shotC = document.getElementById('shotThreeScore').textContent;
          
          if(shot == 1 && shotA){
               this.activeShot = (this.activeShot === shot) ? '' : shot;
          } else if(shot == 2 && (shotA || shotB)){
               this.activeShot = (this.activeShot === shot) ? '' : shot;
          } else if(shot == 3 && (shotB || shotC)){
               this.activeShot = (this.activeShot === shot) ? '' : shot;
          }
          
          console.log(this.activeShot);
     }
     
}
