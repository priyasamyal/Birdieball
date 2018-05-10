import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SingletonService } from '../../services/singleton/singleton';

//import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AddplayerPage } from '../addplayer/addplayer';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-selectgame',
  templateUrl: 'selectgame.html'
})
export class SelectgamePage {

     addPlayerPage = AddplayerPage;     // variable for AddplayerPage
     loginPage = LoginPage;   // variable for LoginPage
     public selectedGameId = null;
     data:any = {}; 
     leaderboardArray = [];
     

     current_page = 1;
     records_per_page = 10;
     total_page = 0;
     paginition_array = [];

     constructor(public navCtrl: NavController, public singleton: SingletonService, public http: Http, public imagePicker: ImagePicker, public camera: Camera) {
          this.http = http;
     }
     
     /**
     * Show modal based on parameter
     * @param {String} modalToShow which modal to show
     */
     showModal(modalToShow) {
          this.singleton.modalCloseFun();
          
          switch(modalToShow) { 
             case 'settingsModal': { 
                this.singleton.settingsModal = true;
                var mThis = this;
                setTimeout(function(){
                       mThis.soundCheck();
                }, 0);
                break; 
             } 
             case 'contactUsModal': { 
                this.singleton.contactUsModal = true;
                break; 
             } 
             case 'leaderBoardModal': {
                this.viewLeaderboardFunc();
                break;    
             } 
             case 'pauseModal': { 
                this.singleton.pauseModal = true; 
                break; 
             } 
             case 'helpModal': { 
                this.singleton.helpModal = true; 
                break; 
             } 
             case 'privacyModal': { 
                this.singleton.privacyModal = true; 
                break; 
             }  
             case 'myAccountModal': { 
                this.getUserDetailFunc();
                break; 
             }  
             case 'logout': { 
                this.singleton.logoutFunc();
                this.navCtrl.setRoot(this.loginPage);
                break; 
             }  
             default: { 
                console.log("Invalid choice"); 
                break;              
             } 
          }
       
     }
     
     /**
     * View leader board
     */
     viewLeaderboardFunc() {
          
          this.singleton.showLoader();

                this.http.get(this.singleton.viewLeaderboardApi)
                .subscribe(data => {
                    var callback = JSON.parse(data["_body"]);
                    console.log(JSON.stringify(callback));

                    this.singleton.hideLoader();
                     // success=true from the server
                    if(callback.meta.success){
                         this.singleton.leaderBoardModal = true;
                         this.leaderboardArray = callback.data.leaderborad_data;
                         console.log(this.leaderboardArray,"leaderboardArray");
                         this.current_page = 1;
                         this.records_per_page = 5;
                         this.total_page = Math.ceil(this.leaderboardArray.length /this.records_per_page
                          );
                          this.changePage();
                    } else {

                         // success=false from the server
                         this.singleton.ajaxSuccessFailHandler(callback);
                    }
                    
                }, error => {
                    console.log("Oooops!"+JSON.stringify(error));
                    this.singleton.hideLoader();
                });
          
     }

     changePage() {
        this.paginition_array = [];
        console.log('change Page', this.current_page);
        for (
          var i = (this.current_page - 1) * this.records_per_page;
          i < this.current_page * this.records_per_page;
          i++
        ) {
          if (i < this.leaderboardArray.length) {
            console.log(i, 'ii');
            this.paginition_array.push(
              this.leaderboardArray[i]
            );
          }
        }
        console.log(this.paginition_array, 'pagi array');
      }

      numPages() {
        return Math.ceil(
          this.leaderboardArray.length /
            this.records_per_page
        );
      }

      prevPage() {
        if (this.current_page > 1) {
          this.current_page--;
          this.changePage();
        }
      }
    
      nextPage() {
        console.log(
          this.current_page,
          'current Page',
          this.leaderboardArray.length
        );
        if (this.current_page < this.numPages()) {
          this.current_page++;
          this.changePage();
        }
      }
     
     /**
     * Select game and show its description based on selected game.
     * @param {String} whichGameSelected which game is selected.
     */
     selectGameFunc(whichGameSelected){
          
          this.selectedGameId = this.singleton.gamesObj[whichGameSelected].game_id;
          
          if(whichGameSelected == 'game_1'){
             document.getElementById('gameName').textContent = 'ROAD GAME';     
             document.getElementById('gameDescription').innerHTML = '<br />1-4 people play this exciting game. <br />Choose 9 or 18 rounds!<br />Each player hits 3 shots.<br />Play for more points.<br />Most points win!';
          } else if(whichGameSelected == 'game_2'){
             document.getElementById('gameName').textContent = 'GOLF DARTS';     
             document.getElementById('gameDescription').innerHTML = '';     
          } else if(whichGameSelected == 'game_3'){
             document.getElementById('gameName').textContent = 'GAME 3';
             document.getElementById('gameDescription').innerHTML = '';       
          } else if(whichGameSelected == 'game_4'){
             document.getElementById('gameName').textContent = 'GAME 4';
             document.getElementById('gameDescription').innerHTML = '';       
          }
     }
     
     /**
     * Set round 9 or 18
     * @param {Number} rounds number of round selected.
     */
     setRoundFunc(rounds){
          document.getElementById('rounds').textContent = rounds;   
     }
     
     /**
     * Go to the next page once the game and its round is selected.
     */
     gameSelectedFunc(){
          
          if(!this.selectedGameId){
             this.selectedGameId = 1;
          }
          
          var numberOfRounds = document.getElementById('rounds').textContent;
          
          this.singleton.selectGameObj = {
               "game_id" : this.selectedGameId,
               "game_rounds" : numberOfRounds
          };
          
          console.log(this.singleton.selectGameObj);
          
          this.navCtrl.push(this.addPlayerPage);
     }
     
     /**
     * Change icon/image on audio on/off and set its value in localStorage.
     */
     onAudioToggle() {
          var myAudio = <HTMLAudioElement>document.getElementById("gameSound");
          var soundImage = <HTMLImageElement>document.getElementById("soundImage");
          
          if (!window.localStorage.getItem('sound') || window.localStorage.getItem('sound') == 'true') {
              myAudio.pause();
              soundImage.src = "assets/imgs/sound_off.png";
              window.localStorage.setItem('sound', 'false');
          } else {
              myAudio.play();
              soundImage.src = "assets/imgs/music.png";
              window.localStorage.setItem('sound', 'true');
          }
     }
     
     /**
     * Change icon/image based on localStorage value.
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
     * Pause/play sound on page launch based on localStorage value.
     */
     ngAfterViewInit() {
          var myAudio = <HTMLAudioElement>document.getElementById("gameSound");
          
          if (!window.localStorage.getItem('sound') || window.localStorage.getItem('sound') == 'true') {
              myAudio.play();
          } else {
              myAudio.pause();
          }
     }
     
     /**
     * Get user detail.
     */
     getUserDetailFunc() {
         
                this.singleton.showLoader();

                this.http.get(this.singleton.userProfileApi)
                .subscribe(data => {
                    var callback = JSON.parse(data["_body"]);
                    console.log(JSON.stringify(callback));

                    this.singleton.hideLoader();
                    if(callback.meta.success){
                         this.singleton.myAccountModal = true;
                         
                         setTimeout(function(){
                              var userProfilePicture = document.getElementById("userProfilePicture") as HTMLImageElement;
                              userProfilePicture.src = callback.data.user_detail.profile_image;
                              
                              document.getElementById('fullname').textContent = callback.data.user_detail.name;
                              document.getElementById('username').textContent = callback.data.user_detail.username;
                              document.getElementById('level').textContent = callback.data.user_detail.level;
                              document.getElementById('signature').textContent = callback.data.user_detail.signature;
                              document.getElementById('highestScore').textContent = callback.data.user_detail.total_score;
                              document.getElementById('gamesWon').textContent = callback.data.user_detail.win_games;
                              document.getElementById('winRate').textContent = callback.data.user_detail.win_rate;
                         }, 10);
                         
                    } else {

                         this.singleton.ajaxSuccessFailHandler(callback);
                    }
                    
                }, error => {
                    console.log("Oooops!"+JSON.stringify(error));
                    this.singleton.hideLoader();
                });
         
    }
     
    /**
    * Upload image to server.
    */
    uploadToServer(imageData) {
          (<any>window).resolveLocalFileSystemURL(imageData, (fileEntry)=>{
                           var doc_data = new FormData();

                         fileEntry.file(file => {
                              var reader = new FileReader();
                              reader.onloadend = (e) => {
                                   var imgBlob = new Blob([reader.result], {
                                        type: file.type
                                   });

                                   doc_data.append('profile_image', imgBlob, file.name);

                                   this.singleton.showLoader();
                                   //make HTTP call
                                   this.http.post(this.singleton.saveProfileImageApi, doc_data)
                                       .subscribe(data => {
                                           this.data.response = data["_body"];
                                           var callback = JSON.parse(this.data.response);
                                           console.log(JSON.stringify(callback));

                                           this.singleton.hideLoader();
                                           if (callback.meta.success) {
                                               this.singleton.commonToast('Profile picture uploaded successfully.');
                                                
                                               window.localStorage.setItem('userProfilePicture', callback.data.profile_image);

                                               var userProfilePicture = document.getElementById("userProfilePicture") as HTMLImageElement;
                                               userProfilePicture.src = callback.data.profile_image;
                                           } else {

                                               this.singleton.ajaxSuccessFailHandler(callback);

                                           }
                                           
                                       }, error => {
                                           console.log("Oooops!" + JSON.stringify(error));
                                           this.singleton.hideLoader();
                                       });

                              };
                              reader.readAsArrayBuffer(file);
                         });

                         console.log("FILE SYSTEM:" + JSON.stringify(fileEntry));
                      }, function (error) {
                          console.log('Error: ' + error);
                      });
     }
     
   /**
   * Open image picker and select image.
   */
   openImagePicker() {
        
        if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
        } else if(window.localStorage.getItem('logged') == 'true'){
             
               const options: CameraOptions = {
                 quality: 100,
                 destinationType: this.camera.DestinationType.FILE_URI,
                 sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                 mediaType: this.camera.MediaType.PICTURE
               }

               var mThis = this;
             
               this.camera.getPicture(options).then((imageData) => {
                      console.log("SOURCE:" + JSON.stringify(imageData));
                    
                      if (imageData.startsWith("Content://") || imageData.startsWith("content://")) {
                              (<any>window).FilePath.resolveNativePath(imageData, function (result) {
                                   imageData = result;
                                   console.log("MODIFIED SOURCE:" + JSON.stringify(imageData)); 
                                   mThis.uploadToServer(imageData);
                              }, function (error) {
                                   throw new Error("");
                              });
                           
                              /*this.filePath.resolveNativePath(path)
                                .then(filePath => console.log(filePath))
                                .catch(err => console.log(err));*/
                           
                      } else {
                           console.log("MODIFIED SOURCE:" + JSON.stringify(imageData)); 
                           mThis.uploadToServer(imageData);
                      }  
                    
               }, (err) => {
                    console.log("IMAGE PICKER ERROR:" + JSON.stringify(err));
               });
             
        }
        
   }
   
}
