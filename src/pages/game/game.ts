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
    activeShot = 1;
    previousRound = 1;
    scoreboardArray=[];
     
     constructor(public commmon:CommonProvider,public alertCtrl: AlertController, public navCtrl: NavController, public singleton: SingletonService, public http: Http) {
            this.http = http;
            this.numberOfRound = Array.from(new Array(this.numberX), (x, i) => i = (i + 1 < 10) ? parseInt('0' + (i + 1)) : i + 1);
      }
     
      getPreviousRoundScore(val) {
        var same_player_array = [];
        this.activeShot=1;
        same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);
        console.log(this.currentPlayerName,"getPreviousRoundScore",same_player_array,this.gameArray,this.currentRound);
       // this.currentPlayerName = same_player_array[0].rounds[this.currentRound-1];

           if(same_player_array.length>0){
               if(same_player_array[0].rounds[this.currentRound-1]==undefined){
                document.getElementById('currentPlayerScore').textContent = '0';
                document.getElementById('shotOneScore').textContent =null;
                document.getElementById('shotTwoScore').textContent =null;
                document.getElementById('shotThreeScore').textContent =null;
               } else{
                console.log('if enter', same_player_array[0].rounds[this.currentRound-1])
                document.getElementById('currentPlayerScore').textContent = same_player_array[0].rounds[this.currentRound-1].round_total;
                document.getElementById('shotOneScore').textContent =same_player_array[0].rounds[this.currentRound-1].shots[0];
                document.getElementById('shotTwoScore').textContent =same_player_array[0].rounds[this.currentRound-1].shots[1];
                document.getElementById('shotThreeScore').textContent = same_player_array[0].rounds[this.currentRound-1].shots[2];
             
               }
                console.log(same_player_array,this.currentRound,same_player_array[0].rounds[this.currentRound-1]);
             
            }else{
                document.getElementById('currentPlayerScore').textContent = '0';
                document.getElementById('shotOneScore').textContent =null;
                document.getElementById('shotTwoScore').textContent =null;
                document.getElementById('shotThreeScore').textContent =null;
            }
            console.log("map calling");

                if (this.currentRound==this.numberOfRound.length){
                    this.gameArray.map(m=>{
                        console.log(m.rounds.length);
                        if(m.rounds.length==this.currentRound){
                            this.currentPlayerName=m.player_name;
                            document.getElementById('currentPlayerScore').textContent = m.round_total;
                            document.getElementById('shotOneScore').textContent = m.rounds[this.currentRound-1].shots[0];
                            document.getElementById('shotTwoScore').textContent = m.rounds[this.currentRound-1].shots[1];
                            document.getElementById('shotThreeScore').textContent = m.rounds[this.currentRound-1].shots[2];
                       }
                    })

                }
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
        let total_score=0;
        var same_player_array = [];
        same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);
        
        // same_player_array[0].rounds[this.currentRound-1].shots[this.activeShot-1]=selectedScore;;

      
        // same_player_array[0].rounds.length > this.currentRound
         if((same_player_array.length>0  && same_player_array[0].rounds.length > this.currentRound) || (!this.isNew && same_player_array.length>0 && same_player_array[0].rounds[this.currentRound-1].shots[this.activeShot-1])){
            console.log(same_player_array[0].rounds.length,this.isNew,"printing")
            

                console.log(this.singleton.selectGameObj.game_rounds,this.gameArray[this.gameArray.length-1].rounds.length,"kk")
            if(this.singleton.selectGameObj.game_rounds==this.gameArray[this.gameArray.length-1].rounds.length){
                this.singleton.scoreBoardModal = true;
                    console.log("submit game result")
                }else{
                    console.log("back move and update score..",this.numberOfRound,);

                    same_player_array[0].rounds[this.currentRound-1].shots[this.activeShot-1]=selectedScore;
                      /**Find total score of rounds */
                                   let subTotal = 0;
                                   same_player_array[0].rounds[this.currentRound-1].shots.map(m=>{
                                   subTotal=Number(m) + subTotal;
                                   })
                                   same_player_array[0].rounds[this.currentRound-1].round_total = subTotal;
                                   /**Find total score of player */
                                   same_player_array[0].rounds.map(m=>{
                                       total_score=Number(m.round_total)+total_score;
                                   })
                                   same_player_array[0].total_score=total_score;
                                     /** Add same_player_array to the final gameArray*/
                                     this.gameArray.map(m=>{
                                       if(m.player_name==this.currentPlayerName){
                                              m=same_player_array[0];
                                              document.getElementById('currentPlayerScore').textContent = same_player_array[0].rounds[this.currentRound-1].round_total;
                                              document.getElementById('shotOneScore').textContent =same_player_array[0].rounds[this.currentRound-1].shots[0];
                                              document.getElementById('shotTwoScore').textContent =same_player_array[0].rounds[this.currentRound-1].shots[1];
                                              document.getElementById('shotThreeScore').textContent = same_player_array[0].rounds[this.currentRound-1].shots[2];
                                       
                                           //  this.commonParameterUpdate(same_player_array[0]);
                                          }
                                      });
                                     console.log(same_player_array[0],"after updating",this.gameArray)
                }
           
           }
        /**Add rounds and score of user in array for first time */
        else if(this.gameArray.length==0 || this.gameArray.filter(data=>data.player_name==this.currentPlayerName).length==0 || this.isNew){
                    var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
                    var userIndex = this.singleton.selectGameObj.user_id.indexOf(playerObj.user_id); 
                    if(this.isNew){
                        this.currentPlayerName = (userIndex+1)==this.singleton.selectGameObj.user_id.length ? this.singleton.selectGameObj.score_array[0].username : this.singleton.selectGameObj.score_array[userIndex+1].username;

                    }
                                                
                    /** new player is pushing in array.. */
                    if(this.gameArray.length==0 || this.gameArray.filter(data=>data.player_name==this.currentPlayerName).length==0 ){
                        this.gameArray.push({
                                'user_id' : playerObj.user_id,
                                'player_name':this.currentPlayerName,
                                'rounds':[{'shots' :[selectedScore], 'round_total':selectedScore}],
                                'total_score':selectedScore
                            });
                            same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);
                         /**Find total score of rounds */
                            let subTotal = 0;
                            same_player_array[0].rounds[this.currentRound-1].shots.map(m=>{
                            subTotal=Number(m) + subTotal;
                            })
                            same_player_array[0].rounds[this.currentRound-1].round_total = subTotal;
                            /**Find total score of player */
                            same_player_array[0].rounds.map(m=>{
                                total_score=Number(m.round_total)+total_score;
                            })
                            same_player_array[0].total_score=total_score;
                        //    console.log("new player is pushing in array..",this.gameArray);
                            this.gameArray.map(m=>{
                                if(m.player_name==this.currentPlayerName){
                                       m=same_player_array[0];
                                      this.commonParameterUpdate(same_player_array[0]);
                                   }
                               });
                    }
                    /**to check  if one round is over */
                    same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);
                     
                    /**to check  if one round is over */
                        if(this.isNew){
                                this.activeShot = 1;
                           
                               if(same_player_array[0].rounds.length-1 <= this.singleton.selectGameObj.game_rounds) { 
                                    /**add array of next round when shots are added in a round */
                                        if(same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.length==3){
                                            if(this.singleton.selectGameObj.game_rounds==this.gameArray[this.gameArray.length-1].rounds.length-1){

                                            }else{
                                                   this.currentRound = this.numberOfRound.length;
                                                if(this.gameArray.filter(data=>data.player_name==this.currentPlayerName).length==0){
                                                        console.log("new player for currewnt round=")
                                                        playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
                                                        userIndex = this.singleton.selectGameObj.user_id.indexOf(playerObj.user_id); 
                                                        this.gameArray.push({
                                                            'user_id' : playerObj.user_id,
                                                            'player_name':this.currentPlayerName,
                                                            'rounds':[{'shots' :[selectedScore], 'round_total':selectedScore}],
                                                            'total_score':selectedScore
                                                        }); 
                                                }
                                                 else{
                                                    if(this.singleton.selectGameObj.game_rounds!=this.gameArray[this.gameArray.length-1].rounds.length-1){

                                                    same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);
                                                    same_player_array[0].rounds.push({'shots' :[selectedScore], 'round_total':selectedScore});
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

                                               //     console.log("ROund change to",this.currentRound,same_player_array,this.currentPlayerName);
                                                    /** Add same_player_array to the final gameArray*/
                                                    this.gameArray.map(m=>{
                                                        if(m.player_name==this.currentPlayerName){
                                                            m=same_player_array[0];
                                                        this.commonParameterUpdate(same_player_array[0]);
                                                        }
                                                    });
                                                 }
                                                }
                                             // console.log("change user of current rounds",same_player_array);
                                            }
                                     }
                                 }

                                    /**increment current round */
                                    if(same_player_array[0].rounds.length==this.singleton.selectGameObj.game_rounds){
                                            // same_player_array[0].rounds.push({'shots' :[selectedScore], 'round_total':selectedScore});
                                            //console.log("increment current round",same_player_array);
                                    }
                        }
                      this.isNew = false;
                     same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName);       
        } 
        
        else {

            /**Add rounds score of user in array after first time */
            same_player_array = this.gameArray.filter(data=>data.player_name==this.currentPlayerName); // to check if points is scoed by current user
            console.log(same_player_array[0].rounds.length,this.singleton.selectGameObj.game_rounds,"f",same_player_array[0])
                    if(same_player_array[0].rounds.length-1 <=this.singleton.selectGameObj.game_rounds) {  // to check if game does not exceeds the round selected
                                   console.log("else block",this.currentRound,this.currentPlayerName)
                                            /**add array of next round when  shots are added in a round */
                                                if(same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.length>2){
                                                    same_player_array[0].rounds.push({'shots' :[selectedScore], 'round_total':selectedScore});
                                                }else{

                                                   // console.log(this.activeShot,"active shot call...")
                                                    same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.push(selectedScore);
                                                   //same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots[this.activeShot-1]=selectedScore;
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
      //  console.log(JSON.stringify(same_player_array[0]));
         this.scoreArray.map(m=>{
            if(m.username==this.currentPlayerName){
                m.total_score=same_player_array[0].total_score;
            }
         });
                  
    if(same_player_array[0].rounds[same_player_array[0].rounds.length-1].shots.length==3 && this.numberOfRound.length==this.currentRound){
                    var playerObj = this.singleton.getObjectBasedOnValueFunc(this.scoreArray, "username", this.currentPlayerName);
                    var userIndex = this.singleton.selectGameObj.user_id.indexOf(playerObj.user_id);
                    console.log(this.gameArray[this.gameArray.length-1].rounds.length-1,"final round length",this.singleton.selectGameObj.game_rounds,userIndex+"userIndex",this.singleton.selectGameObj.user_id.length)
                    if(userIndex+1==this.singleton.selectGameObj.user_id.length){
                        console.log("enter final if")
                        if(this.singleton.selectGameObj.game_rounds==this.gameArray[this.gameArray.length-1].rounds.length){
                            this.singleton.scoreBoardModal = true;
                            console.log('stop... round over');
                         //   this.navCtrl.push(this.selectGamePage)
                                 let pos=0;
                                this.gameArray.map(m=>{
                                     this.scoreboardArray.push({
                                        total_score:m.total_score,
                                        username:m.player_name,
                                        position:1
                                    });
                                })

                                this.scoreboardArray.sort(function (a, b) {
                                    return b.total_score - a.total_score;
                                  });
                                 
                                  this.scoreboardArray.map((m,index)=>{
                                     m.position=this.singleton.getOrdinal(index+1);
                                   })
                                  console.log(this.scoreboardArray)
                                  

                        }else{
                            this.numberOfRound = Array.from(new Array(this.numberOfRound.length+1), (x, i) => i = i + 1);
                            }
                           }
                    this.isNew = true;
                  //  console.log(this.currentPlayerName,this.scoreArray, this.singleton.selectGameObj.user_id,"last...");
                }
             if( same_player_array[0].rounds[this.currentRound-1].shots.length==2){
                    this.activeShot = 3;
               } else if( same_player_array[0].rounds[this.currentRound-1].shots.length==1){
                    this.activeShot = 2;
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
          
     }

    commonParameterUpdate(data){
   // console.log(data,"show data on screen",data.rounds.length)
    document.getElementById('currentPlayerScore').textContent = data.rounds[data.rounds.length-1].round_total;
    document.getElementById('shotOneScore').textContent =data.rounds[data.rounds.length-1].shots[0];
    document.getElementById('shotTwoScore').textContent =data.rounds[data.rounds.length-1].shots[1];
    document.getElementById('shotThreeScore').textContent = data.rounds[data.rounds.length-1].shots[2];
    console.log(this.gameArray,"complete game Arrray")
     }
      
   
 }