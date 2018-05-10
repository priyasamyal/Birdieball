import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SingletonService } from '../../services/singleton/singleton';

import { SelectgamePage } from '../selectgame/selectgame';

@Component({
  selector: 'page-gameplay',
  templateUrl: 'gameplay.html'
})
export class GameplayPage {

  selectGamePage = SelectgamePage;

     scoreArray;
     tempArray;
     scoreboardArray;
     
    data:any = {};     
     
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public singleton: SingletonService, public http: Http) {
       this.http = http;
  }

     pauseModalOpenFun() {
          this.singleton.modalCloseFun();
          this.singleton.pauseModal = true;
          
          var mThis = this;
          setTimeout(function(){
               mThis.soundCheck();
          }, 100);
     }

     helpModalOpenFun() {
          this.singleton.modalCloseFun();
          this.singleton.helpModal = true;
     }

     soundCheck() {
          var soundImage = <HTMLImageElement>document.getElementById("soundImage");
          
          if (!window.localStorage.getItem('sound') || window.localStorage.getItem('sound') == 'true') {
              soundImage.src = "assets/imgs/music.png";
          } else if(window.localStorage.getItem('sound') == 'false') {
              soundImage.src = "assets/imgs/sound_off.png";
          }
     }
     
     backToSelectGamePageFunc() {
          this.singleton.modalCloseFun();
          this.navCtrl.setRoot(this.selectGamePage);
     }
     
     mainMenuFunc() {
          
          let confirm = this.alertCtrl.create({
           title: "Warning",
           message: "Are you sure you want to exit this game.",
           buttons: [
             {
               text: "YES",
               handler: () => {
                   console.log('Agree clicked');
                   window.sessionStorage.setItem('isGamePage', '');
                   this.navCtrl.setRoot(this.selectGamePage);
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
     
     ngAfterViewInit() {
          
          this.scoreArray = [];
          for(var i = 0; i < this.singleton.selectGameObj.user_id.length; i++) {
               var currentUser = this.singleton.getObjectBasedOnValueFunc(this.singleton.allActiveUsers, "user_id", this.singleton.selectGameObj.user_id[i]);
               this.scoreArray.push({"username" : currentUser.username, "total_score" : 0});
          }

          this.singleton.selectGameObj["score_array"] = this.scoreArray;
          
          console.log(this.singleton.selectGameObj);
          
          document.getElementById('currentPlayerName').textContent = this.singleton.selectGameObj.score_array[0].username;
          document.getElementById('currentPlayerScore').textContent = ' 0';
          document.getElementById('currentRound').textContent = '01';
          
          this.tempArray = {
               "gameId": this.singleton.selectGameObj.game_id,
               "roundId": this.singleton.selectGameObj.round_id,
               "userId": this.singleton.selectGameObj.user_id[0],
               "username": this.singleton.selectGameObj.score_array[0].username,
               "currentRound" : 1,
               "is_last_shot" : 0,
               "shots" : {
                    "one" : "0",
                    "two" : "0",
                    "three" : "0"
               }
          }
          
     }
     
     scorePointFunc(selectedScore) {
          console.log("selectedScore:" + selectedScore);
          
          console.log(this.tempArray);
          
          var shotIndex, isLastShot = 0;
          if(this.tempArray.shots.one == "0"){
             shotIndex = 1;
          } else if(this.tempArray.shots.two == "0"){
             shotIndex = 2;          
          } else if(this.tempArray.shots.three == "0"){
             shotIndex = 3; 
             isLastShot = this.tempArray.is_last_shot;     
          }
          
                var currentPlayerScoreObj = {
                       "user_id" : this.tempArray.userId,
                       "game_id" : this.tempArray.gameId,
                       "round_id" : this.tempArray.roundId,
                       "shot_point" : selectedScore,
                       "shot" : shotIndex,
                       "round_number": this.tempArray.currentRound,
                       "is_last_shot" : isLastShot
               };
                
          
                this.singleton.showLoader();

                var myData = JSON.stringify(currentPlayerScoreObj);
                console.log(myData);
                
                this.http.post(this.singleton.updateCurrentGameScoreApi, myData)
                .subscribe(data => {
                    this.data.response = data["_body"]; 
                    var callback = JSON.parse(this.data.response);
                    console.log(JSON.stringify(this.data));

                    this.singleton.hideLoader();
                    if(callback.meta.success) {
                         
                         if(currentPlayerScoreObj.is_last_shot == 1){
                              
                              this.singleton.scoreBoardModal = true;
                              
                              this.scoreboardArray = callback.data.result_list;
                              
                         } else {
                            
                              this.scoreArray = callback.data.others_details;
                         
                              document.getElementById('currentPlayerName').textContent = callback.data.my_details.username;
                              document.getElementById('currentPlayerScore').textContent = callback.data.my_details.total_score;
                              document.getElementById('shotOneScore').textContent = callback.data.my_details.shot_point_1;
                              document.getElementById('shotTwoScore').textContent = callback.data.my_details.shot_point_2;
                              document.getElementById('shotThreeScore').textContent = callback.data.my_details.shot_point_3;

                              var nextUserId = callback.data.my_details.user_id, nextUsername = callback.data.my_details.username, defaultScore = 0, currentRoundNumber = callback.data.my_details.round_number, isLastShot = 0;
                              if(callback.data.my_details.shot_point_3 != '0') {

                                   var userIndex = this.singleton.selectGameObj.user_id.indexOf(callback.data.my_details.user_id);
                                   userIndex = userIndex + 1;
                                   console.log("userIndex:" + userIndex + "|" + this.singleton.selectGameObj.user_id.length);
                                   if(userIndex == this.singleton.selectGameObj.user_id.length) {
                                        userIndex = 0;
                                        currentRoundNumber = parseInt(currentRoundNumber) + 1;
                                   }

                                   console.log("userIndexI:" + currentRoundNumber + "|" + userIndex + "|" + this.singleton.selectGameObj.user_id.length);

                                   nextUserId = this.singleton.selectGameObj.user_id[userIndex];
                                   nextUsername = this.singleton.selectGameObj.score_array[userIndex].username;

                                   callback.data.my_details.shot_point_1 = defaultScore;
                                   callback.data.my_details.shot_point_2 = defaultScore;
                                   callback.data.my_details.shot_point_3 = defaultScore;

                                   var roundNumber = (currentRoundNumber<10) ? '0'+currentRoundNumber : currentRoundNumber;

                                   document.getElementById('currentPlayerName').textContent = nextUsername;
                                   document.getElementById('currentPlayerScore').textContent = ' 0';
                                   document.getElementById('currentRound').textContent = roundNumber;
                                   document.getElementById('shotOneScore').textContent = '';
                                   document.getElementById('shotTwoScore').textContent = '';
                                   document.getElementById('shotThreeScore').textContent = '';
                              }

                              if(currentRoundNumber == this.singleton.selectGameObj.game_rounds && callback.data.my_details.shot_point_2 != '0'){
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
                                        "one" : callback.data.my_details.shot_point_1,
                                        "two" : callback.data.my_details.shot_point_2,
                                        "three" : callback.data.my_details.shot_point_3
                                   }
                              }
                              console.log(this.tempArray);
                         
                         }
                         
                    } else {
                         this.singleton.ajaxSuccessFailHandler(callback);
                    }
                    
                }, error => {
                    console.log("Oooops!"+JSON.stringify(error));
                    this.singleton.hideLoader();
                });

     }
     
}

