import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { SelectSearchable } from 'ionic-select-searchable';
import { FormBuilder} from '@angular/forms';
import { Http } from '@angular/http';
import { SingletonService } from '../../services/singleton/singleton';

import { SelectgamePage } from '../selectgame/selectgame';

import { Game1playPage } from '../game/game';
import { GameplayPage } from '../gameplay/gameplay';
import { Gamep3layPage } from '../gamethree/gamethree';
import { Gamep4layPage } from '../gamefour/gamefour';

@Component({
  selector: 'page-addplayer',
  templateUrl: 'addplayer.html'
})

export class AddplayerPage {

  addgamePage = SelectgamePage;    // variable for SelectgamePage
     
  roadGame = Game1playPage;   // variable for Game1playPage
  gameFour = GameplayPage;    // variable for GameplayPage
  gameThree = Gamep3layPage;  // variable for Gamep3layPage
  golfDart = Gamep4layPage;   // variable for Gamep4layPage
     
  playerAdd;
  playerOne;
  playerTwo;
  playerThree;
  playerFour;
     
  data:any = {};
     
  items: any = [];
     
  constructor(public navCtrl: NavController, public http: Http, public singleton: SingletonService, public formBuilder: FormBuilder, public alertCtrl: AlertController) {

          // reset variables
          this.playerOne = '';
          this.playerTwo = '';
          this.playerThree = '';
          this.playerFour = '';
          this.http = http;
       
          // assign activeUsers array to tempActiveUsers array
          this.singleton.tempActiveUsers = this.singleton.activeUsers;
       
          // form builder
          this.playerAdd = formBuilder.group({
                  playerOne: ['', ''],
                  playerTwo: ['', ''],
                  playerThree: ['', ''],
                  playerFour: ['', '']
          });
       
          // get username from localStorage to variable named playerOne
          this.playerOne = window.localStorage.getItem('username');
       
  }
     
    /**
     * Get selected value on change and remove that object from the list
     */
    portChange(event: { component: SelectSearchable, value: any }) {
//        console.log('port:', event.value);
        //event.value["is_visible"] = false;
        this.singleton.tempActiveUsers = this.singleton.activeUsers;
        this.singleton.tempActiveUsers = this.singleton.tempActiveUsers.filter(obj => obj !== this.playerTwo);
        this.singleton.tempActiveUsers = this.singleton.tempActiveUsers.filter(obj => obj !== this.playerThree);
        this.singleton.tempActiveUsers = this.singleton.tempActiveUsers.filter(obj => obj !== this.playerFour);
    }
     
    /**
     * Reset field along with clicked cross icon
     */
    resetCurrentField(fieldName){
         
        this[fieldName] = '';
         
        if(this.singleton.isUserLoggedIn) {
             this.singleton.tempActiveUsers = this.singleton.activeUsers;
             this.singleton.tempActiveUsers = this.singleton.tempActiveUsers.filter(obj => obj !== this.playerTwo);
             this.singleton.tempActiveUsers = this.singleton.tempActiveUsers.filter(obj => obj !== this.playerThree);
             this.singleton.tempActiveUsers = this.singleton.tempActiveUsers.filter(obj => obj !== this.playerFour);
        }
        
    }
     
    /**
     * Save selected game details and user details
     */
    addPlayerFunc() {
         
              var userIdArray = [];
              userIdArray.push(window.localStorage.getItem('userId'));
              (this.playerTwo) ? userIdArray.push(this.playerTwo.user_id) : '';
              (this.playerThree) ? userIdArray.push(this.playerThree.user_id) : '';
              (this.playerFour) ? userIdArray.push(this.playerFour.user_id) : '';

              this.singleton.selectGameObj["user_id"] = userIdArray;
              console.log(this.singleton.selectGameObj);

                     this.singleton.showLoader();

                     var myData = JSON.stringify(this.singleton.selectGameObj);
                     console.log(myData);

                     this.http.post(this.singleton.postSelectGameApi, myData)
                     .subscribe(data => {
                         this.data.response = data["_body"]; 
                         var callback = JSON.parse(this.data.response);
                         console.log("CALLBACK:"+JSON.stringify(this.data));

                         this.singleton.hideLoader();
                          // success=true from the server
                         if(callback.meta.success){

                              // set game page to true in localstorage
                              window.sessionStorage.setItem('isGamePage', 'true');

                              // add round id as object
                              this.singleton.selectGameObj["round_id"] = callback.data.round_id;

                              // open selected game
                              switch(this.singleton.selectGameObj.game_id) { 
                                 case 1: { 
                                    this.navCtrl.push(this.roadGame);
                                    break; 
                                 } 
                                 case 2: { 
                                    this.navCtrl.push(this.golfDart);
                                    break; 
                                 } 
                                 case 3: {
                                    this.navCtrl.push(this.gameThree);
                                    break;    
                                 } 
                                 case 4: { 
                                    this.navCtrl.push(this.gameFour);
                                    break; 
                                 }  
                              }
                         } else {

                              // success=false from the server side
                              if (callback.data.errors.type == 'validation') {
                                   var validationErrors = "";

                                   // create a single string from validation array.
                                   for (var propName in callback.data.errors.array) {
                                        if (callback.data.errors.array.hasOwnProperty(propName)) {
                                             validationErrors += callback.data.errors.array[propName] + "<br>";
                                        }
                                   }
                                   this.singleton.doAlert('', validationErrors, 'Ok');
                              } else {
                                   this.singleton.ajaxSuccessFailHandler(callback);
                              }
                         }
                         
                     }, error => {
                         console.log("Oooops!"+JSON.stringify(error));
                         this.singleton.hideLoader();
                     });
         
    }

}
