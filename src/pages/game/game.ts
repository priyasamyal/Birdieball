import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SingletonService } from '../../services/singleton/singleton';

import { SelectgamePage } from '../selectgame/selectgame';
import {CommonProvider} from '../../providers/common/common';
@Component({
  selector: 'page-gameplay1',
  templateUrl: 'game.html'
})
export class Game1playPage {
    isdisabled:boolean=false;
    isNew:boolean=false;
    numberX =  1;
    numberOfRound =  [];
    gameArray=[];

    selectGamePage = SelectgamePage;    // variable for SelectgamePage
    currentPlayerName: any;
    currentRound: any;
    scoreArray = [];
    tempArray;
    scoreboardArray;
    data:any = {};   
    activeShot = 1;
     
    previousRound = 1;
     
     constructor(public commmon:CommonProvider,public alertCtrl: AlertController, public navCtrl: NavController, public singleton: SingletonService, public http: Http) {
            this.http = http;
            this.numberOfRound = Array.from(new Array(this.numberX), (x, i) => i = (i + 1 < 10) ? parseInt('0' + (i + 1)) : i + 1);
        
          
     }
     
      getPreviousRoundScore(val) {

        let total_score=0;
        var same_player_array = [];
        
       console.log(val,"value", this.currentPlayerName);
     
       same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);

        if(same_player_array[0].rounds[this.currentRound-1].shots.length==3){
            var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
            var userIndex = this.singleton.selectGameObj.user_id.indexOf(playerObj.user_id);

            //this.currentPlayerName = (userIndex+1)==this.singleton.selectGameObj.user_id.length ? this.singleton.selectGameObj.score_array[0].username : this.singleton.selectGameObj.score_array[userIndex+1].username;
            document.getElementById('currentPlayerScore').textContent = '0';
            document.getElementById('shotOneScore').textContent =null;
            document.getElementById('shotTwoScore').textContent =null;
            document.getElementById('shotThreeScore').textContent = null;
        
            console.log(this.currentPlayerName,this.scoreArray, this.singleton.selectGameObj.user_id,"last...");
        } else {

        }
    
//         if(this.previousRound < this.tempArray.currentRound){
//              this.previousRound = this.tempArray.currentRound;
//           }
          
//           var getSpecificRoundScore = this.currentRound;
//           if(val === "recheck"){
//                this.numberOfRound = Array.from(new Array(this.previousRound), (x, i) => i = (i + 1 < 10) ? parseInt('0' + (i + 1)) : i + 1);
//                this.currentRound = this.previousRound;
//           }
          
//           console.log(val + "|" + this.currentRound + "|" + this.currentPlayerName+"|"+this.previousRound+"|"+getSpecificRoundScore);
//           console.log(this.previousRound,"previousRound")
//           if(val<this.previousRound){
//             console.log(val,"value",this.previousRound)
//             this.isdisabled=false;
//           }else if(val==this.previousRound){
//             this.isdisabled=true;
//           }
//           var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
          
//           var getPreviousRoundScoreObj = {
//                "user_id" : playerObj.user_id,
//                "game_id" : this.tempArray.gameId,
//                "round_id" : this.tempArray.roundId,
//                "round_number": this.currentRound
//           };
          
//           console.log(JSON.stringify(getPreviousRoundScoreObj));
          
//           this.http.post(this.singleton.getPreviousRoundScoreApi, JSON.stringify(getPreviousRoundScoreObj))
//                      .subscribe(data => {
//                          this.data.response = data["_body"]; 
//                          var callback = JSON.parse(this.data.response);
// //                         console.log(JSON.stringify(this.data));

//                          this.singleton.hideLoader();
//                          if(callback.meta.success) {
                              
//                                    this.currentPlayerName = callback.data.my_details.username;
//                                    document.getElementById('currentPlayerScore').textContent = callback.data.my_details.total_score;
//                                    document.getElementById('shotOneScore').textContent = callback.data.my_details.shot_point_1;
//                                    document.getElementById('shotTwoScore').textContent = callback.data.my_details.shot_point_2;
//                                    document.getElementById('shotThreeScore').textContent = callback.data.my_details.shot_point_3;

//                                    this.scoreArray = callback.data.others_details;
                              
//                                    if(callback.data.my_details.shot_point_3){
//                                         this.activeShot = 1;
//                                    } else if(callback.data.my_details.shot_point_2){
//                                         this.activeShot = 3;
//                                    } else if(callback.data.my_details.shot_point_1){
//                                         this.activeShot = 2;
//                                    }
                              
//                                    this.tempArray = {
//                                              "gameId": this.singleton.selectGameObj.game_id,
//                                              "roundId": this.singleton.selectGameObj.round_id,
//                                              "userId": callback.data.my_details.user_id,
//                                              "username": callback.data.my_details.username,
//                                              "currentRound" : this.currentRound,
//                                              "is_last_shot" : this.tempArray.is_last_shot,
//                                              "shots" : {
//                                                   "one" : callback.data.my_details.shot_point_1,
//                                                   "two" : callback.data.my_details.shot_point_2,
//                                                   "three" : callback.data.my_details.shot_point_3
//                                              }
//                                    }

//                          } 
                         
//                      }, error => {
//                          console.log("Oooops!" + JSON.stringify(error));
//                          this.singleton.hideLoader();
//                      });
      }
     
//      /**
//      * Run function when page launch and set default score, name and users playing this game
//      */
     ngAfterViewInit() {
                
               // reset score array
               this.scoreArray = [];
               // push username and total score object in score array
               for(var i = 0; i < this.singleton.selectGameObj.user_id.length; i++) {
                    var currentUser = this.singleton.getObjectBasedOnValueFunc(this.singleton.allActiveUsers, "user_id", this.singleton.selectGameObj.user_id[i]);
                    this.scoreArray.push({"user_id" : this.singleton.selectGameObj.user_id[i], "username" : currentUser.username, "total_score" : "0"});
               }

               this.singleton.selectGameObj["score_array"] = this.scoreArray;

               console.log(this.singleton.selectGameObj);

               // set first player username 
               this.currentPlayerName = this.singleton.selectGameObj.score_array[0].username;
               // set score
               document.getElementById('currentPlayerScore').textContent = ' 0';
               // set round
               this.currentRound = '1';

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
               

               var myAudio = <HTMLAudioElement>document.getElementById("gameSound1");
               console.log(myAudio,"myAudio")
              
               if (!window.localStorage.getItem('sound') || window.localStorage.getItem('sound') == 'true') {
                   myAudio.play();
               } else {
                   myAudio.pause();
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

        this.commmon.showPromptOk('Warning', 'Are you sure you want to exit this game.',  (res) => {
                console.log("callback called",res)
                if(res=='yes'){
                    this.backToSelectGamePageFunc();
                }
          })
     }
     
     /**
     * Set score of current shot.
     */
      scorePointFunc(selectedScore) {
        //   console.log("TEMPARR1"+JSON.stringify(this.tempArray));
        //   var isLastShot = 0;
        //     if(this.activeShot == 0){
        //         this.singleton.commonToast("Please select the shot first to proceed to score.");  
        //    }
        //    else {
               
        //        if(this.tempArray.is_last_shot == 1 && (this.tempArray.shots.one != "null" && this.tempArray.shots.two != "null") || (this.tempArray.shots.one != "null" &&  this.tempArray.shots.three != "null") || (this.tempArray.shots.three != "null" && this.tempArray.shots.two != "null")){
        //             isLastShot = this.tempArray.is_last_shot; 
        //        }
               
        //             // create object to send it to the server
        //              var currentPlayerScoreObj = {
        //                     "user_id" : this.tempArray.userId,
        //                     "game_id" : this.tempArray.gameId,
        //                     "round_id" : this.tempArray.roundId,
        //                     "shot_point" : selectedScore,
        //                     "shot" : this.activeShot,
        //                     "round_number": this.tempArray.currentRound,
        //                     "is_last_shot" : isLastShot
        //             };
                 

        //              // show loader
        //              this.singleton.showLoader();

        //              var myData = JSON.stringify(currentPlayerScoreObj);
        //              console.log("MYDATA:" + myData);

        //              this.http.post(this.singleton.updateCurrentGameScoreApi, myData)
        //              .subscribe(data => {
        //                  this.data.response = data["_body"]; 
        //                  var callback = JSON.parse(this.data.response);
        //                  console.log(JSON.stringify(this.data));

        //                  this.singleton.hideLoader();
        //                  if(callback.meta.success) {
                              
        //                       if(currentPlayerScoreObj.is_last_shot == 1){
                                   
        //                            this.scoreArray = [];
        //                            this.currentPlayerName = '';
        //                            document.getElementById('currentPlayerScore').textContent = '';
        //                            this.currentRound = '1';
        //                            document.getElementById('shotOneScore').textContent = '';
        //                            document.getElementById('shotTwoScore').textContent = '';
        //                            document.getElementById('shotThreeScore').textContent = '';

        //                            this.singleton.scoreBoardModal = true;

        //                            this.scoreboardArray = callback.data.result_list;

        //                       } else {

        //                            this.scoreArray = callback.data.others_details;

        //                            this.currentPlayerName = callback.data.my_details.username;
        //                            document.getElementById('currentPlayerScore').textContent = callback.data.my_details.total_score;
        //                            document.getElementById('shotOneScore').textContent = callback.data.my_details.shot_point_1;
        //                            document.getElementById('shotTwoScore').textContent = callback.data.my_details.shot_point_2;
        //                            document.getElementById('shotThreeScore').textContent = callback.data.my_details.shot_point_3;

        //                            var nextUserId = callback.data.my_details.user_id, nextUsername = callback.data.my_details.username, defaultScore = "null", currentRoundNumber = callback.data.my_details.round_number, isLastShot = 0;
                                   
        //                            if(callback.data.my_details.shot_point_3){
        //                                 this.activeShot = 1;
        //                            } else if(callback.data.my_details.shot_point_2){
        //                                 this.activeShot = 3;
        //                            } else if(callback.data.my_details.shot_point_1){
        //                                 this.activeShot = 2;
        //                            }
                                   
        //                            if(callback.data.my_details.shot_point_1 && callback.data.my_details.shot_point_2 && callback.data.my_details.shot_point_3) {

        //                                 var userIndex = this.singleton.selectGameObj.user_id.indexOf(callback.data.my_details.user_id);
        //                                 userIndex = userIndex + 1;
                                        
        //                                 if(userIndex == this.singleton.selectGameObj.user_id.length) {
        //                                      userIndex = 0;
        //                                      currentRoundNumber = parseInt(currentRoundNumber) + 1;
        //                                 }

        //                                 nextUserId = this.singleton.selectGameObj.user_id[userIndex];
        //                                 nextUsername = this.singleton.selectGameObj.score_array[userIndex].username;

        //                                 callback.data.my_details.shot_point_1 = defaultScore;
        //                                 callback.data.my_details.shot_point_2 = defaultScore;
        //                                 callback.data.my_details.shot_point_3 = defaultScore;

        //                                 var roundNumber = (currentRoundNumber < 10) ? currentRoundNumber : currentRoundNumber;

        //                                 this.currentPlayerName = nextUsername;
        //                                 // document.getElementById('currentPlayerScore').textContent = ' 0';
        //                                 // document.getElementById('shotOneScore').textContent = '';
        //                                 // document.getElementById('shotTwoScore').textContent = '';
        //                                 // document.getElementById('shotThreeScore').textContent = '';
        //                                 this.currentRound = roundNumber;
        //                            }

        //                            var tempUserIndex = this.singleton.selectGameObj.user_id.indexOf(callback.data.my_details.user_id);
        //                            tempUserIndex = tempUserIndex + 1;
                                   
        //                            if(currentRoundNumber == this.singleton.selectGameObj.game_rounds && callback.data.my_details.shot_point_2 && tempUserIndex == this.singleton.selectGameObj.user_id.length){
        //                                 isLastShot = 1;
        //                            }

                                //    this.tempArray = {
                                //         "gameId": this.singleton.selectGameObj.game_id,
                                //         "roundId": this.singleton.selectGameObj.round_id,
                                //         "userId": nextUserId,
                                //         "username": nextUsername,
                                //         "currentRound" : currentRoundNumber,
                                //         "is_last_shot" : isLastShot,
                                //         "shots" : {
                                //              "one" : callback.data.my_details.shot_point_1 ? callback.data.my_details.shot_point_1 : defaultScore,
                                //              "two" : callback.data.my_details.shot_point_2 ? callback.data.my_details.shot_point_2 : defaultScore,
                                //              "three" : callback.data.my_details.shot_point_3 ? callback.data.my_details.shot_point_3 : defaultScore
                                //         }
                                //    }

            //                        this.commonParameterUpdate(callback,nextUserId,nextUsername,currentRoundNumber,isLastShot);
                                   
            //                        this.numberOfRound = Array.from(new Array(parseInt(currentRoundNumber)), (x, i) => i = (i + 1 < 10) ? parseInt('0' + (i + 1)) : i + 1);
            //                        console.log("TEMPARR2"+JSON.stringify(this.tempArray)+"|"+this.activeShot);

            //                        //this.getPreviousRoundScore("recheck");
            //                   }

            //              } else {
            //                   this.singleton.ajaxSuccessFailHandler(callback);
            //              }
                         
            //          }, error => {
            //              console.log("Oooops!" + JSON.stringify(error));
            //              this.singleton.hideLoader();
            //          });
            //    }


    let total_score=0;
    var same_player_array = [];

     /**Add rounds andscore of user in array for first time */
    if(this.gameArray.length==0 || this.gameArray.filter(data=>data.player_name==this.currentPlayerName).length==0 || this.isNew){
       
        var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
        var userIndex = this.singleton.selectGameObj.user_id.indexOf(playerObj.user_id);

        if(this.gameArray.length>0){
            console.log("In"+userIndex);
            this.currentPlayerName = (userIndex+1)==this.singleton.selectGameObj.user_id.length ? this.singleton.selectGameObj.score_array[0].username : this.singleton.selectGameObj.score_array[userIndex+1].username;
            this.currentRound = Number(this.currentRound)+1;

            document.getElementById('shotOneScore').textContent =null;
            document.getElementById('shotTwoScore').textContent =null;
            document.getElementById('shotThreeScore').textContent = null;

           
        }
    

        var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
        this.gameArray.push({
            'user_id' : playerObj.user_id,
            'player_name':this.currentPlayerName,
            'rounds':[{'shots' :[selectedScore], 'round_total':selectedScore}],
            'total_score':selectedScore
        });

        same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);
      this.isNew = false;

        //total_score=selectedScore;
        this.commonParameterUpdate(same_player_array[0])
    } else {
        
        /**Add rounds score of user in array after first time */
       
        same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName); // to check if points is scoed by current user
            
        if(same_player_array[0].rounds.length < this.singleton.selectGameObj.game_rounds) {  // to check if game does not exceeds the round selected
           
            
            /**add array of next round when  shots are added in a round */
            if(same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.length>2){
                same_player_array[0].rounds.push({'shots' :[selectedScore], 'round_total':selectedScore});
            }else{
                same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.push(selectedScore);
            }
          
           /**Find total score of rounds */
            let subTotal = 0;
            same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.map(m=>{
               subTotal=Number(m) + subTotal;
            })
            same_player_array[0].rounds[same_player_array[0].rounds.length-1].round_total = subTotal;
               
            /**Find total score of player */
            same_player_array[0].rounds.map(m=>{
                 
                  total_score=Number(m.round_total)+total_score;
               })
            same_player_array[0].total_score=total_score;
           
        }
      
        /** Add same_player_array to the final gameArray*/
        this.gameArray.map(m=>{
            if(m.player_name==this.currentPlayerName){
                m=same_player_array[0];
              this.commonParameterUpdate(same_player_array[0]);
            }
        });

    }

   
     console.log(JSON.stringify(same_player_array[0]));
     this.scoreArray.map(m=>{
        if(m.username==this.currentPlayerName){
            m.total_score=same_player_array[0].total_score;
        }
     });
     //console.log(JSON.stringify(this.scoreArray));
               // push username and total score object in score array
              

            if(same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.length==3){
                var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
                var userIndex = this.singleton.selectGameObj.user_id.indexOf(playerObj.user_id);

                if(userIndex+1==this.singleton.selectGameObj.user_id.length){
                    this.numberOfRound = Array.from(new Array(same_player_array[0].rounds.length+1), (x, i) => i = i + 1);
                }
                this.isNew = true;
                
                console.log(this.currentPlayerName,this.scoreArray, this.singleton.selectGameObj.user_id,"last...");
            }

            // if(same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.length==3){
            //     var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
            //     var userIndex = this.singleton.selectGameObj.user_id.indexOf(playerObj.user_id);

            //     this.currentPlayerName = (userIndex+1)==this.singleton.selectGameObj.user_id.length ? this.singleton.selectGameObj.score_array[0].username : this.singleton.selectGameObj.score_array[userIndex+1].username;
            //     document.getElementById('currentPlayerScore').textContent = '0';
            //     document.getElementById('shotOneScore').textContent =null;
            //     document.getElementById('shotTwoScore').textContent =null;
            //     document.getElementById('shotThreeScore').textContent = null;
            // }
               
   
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
          
     }

//        /**
//      * Change icon/image on audio on/off and set its value in localStorage.
//      */
//     onAudioToggle() {
//         var myAudio = <HTMLAudioElement>document.getElementById("gameSound1");
//         var soundImage = <HTMLImageElement>document.getElementById("soundImage");
        
//         if (!window.localStorage.getItem('sound') || window.localStorage.getItem('sound') == 'true') {
//             myAudio.pause();
//             soundImage.src = "assets/imgs/sound_off.png";
//             window.localStorage.setItem('sound', 'false');
//         } else {
//             myAudio.play();
//             soundImage.src = "assets/imgs/music.png";
//             window.localStorage.setItem('sound', 'true');
//         }
//    }

   commonParameterUpdate(data){

    

    console.log(data,"show data on screen",data.rounds.length)
    document.getElementById('currentPlayerScore').textContent = data.rounds[data.rounds.length-1].round_total;
    document.getElementById('shotOneScore').textContent =data.rounds[data.rounds.length-1].shots[0];
    document.getElementById('shotTwoScore').textContent =data.rounds[data.rounds.length-1].shots[1];
    document.getElementById('shotThreeScore').textContent = data.rounds[data.rounds.length-1].shots[2];

    // this.tempArray = {
    //     "gameId": this.singleton.selectGameObj.game_id,
    //     "roundId": this.singleton.selectGameObj.round_id,
    //     "userId": nextUserId,
    //     "username": nextUsername,
    //     "currentRound" : currentRoundNumber,

    //     "is_last_shot" : isLastShot,
    //     "shots" : {
    //          "one" : callback.data.my_details.shot_point_1 ? callback.data.my_details.shot_point_1 : null,
    //          "two" : callback.data.my_details.shot_point_2 ? callback.data.my_details.shot_point_2 : null,
    //          "three" : callback.data.my_details.shot_point_3 ? callback.data.my_details.shot_point_3 : null
    //     }
    //  }



    // document.getElementById('currentPlayerScore').textContent = callback.data.my_details.total_score;
    // document.getElementById('shotOneScore').textContent = callback.data.my_details.shot_point_1;
    // document.getElementById('shotTwoScore').textContent = callback.data.my_details.shot_point_2;
    // document.getElementById('shotThreeScore').textContent = callback.data.my_details.shot_point_3;

    // this.tempArray = {
    //     "gameId": this.singleton.selectGameObj.game_id,
    //     "roundId": this.singleton.selectGameObj.round_id,
    //     "userId": nextUserId,
    //     "username": nextUsername,
    //     "currentRound" : currentRoundNumber,

    //     "is_last_shot" : isLastShot,
    //     "shots" : {
    //          "one" : callback.data.my_details.shot_point_1 ? callback.data.my_details.shot_point_1 : null,
    //          "two" : callback.data.my_details.shot_point_2 ? callback.data.my_details.shot_point_2 : null,
    //          "three" : callback.data.my_details.shot_point_3 ? callback.data.my_details.shot_point_3 : null
    //     }
    //  }

    



   }
      
   
 }
