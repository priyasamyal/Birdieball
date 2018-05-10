import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import {Observable} from 'rxjs';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { SingletonService } from '../../services/singleton/singleton';
import {ApiProvider} from '../api/api';
/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonProvider {

  constructor(public alertCtrl: AlertController,public http: Http, public api: ApiProvider,public singleton:SingletonService) {
    console.log('Hello CommonProvider Provider');
  }

  

  common_api(api,method,data){
    this.singleton.showLoader();
    console.log(data, api+'Input Json');
    return new Promise((resolve, reject) => {

      if(method=='post'){
        this.api.post(api, data)
        .map(res => res.json())
          .subscribe(
            res => {
              this.singleton.hideLoader();
              console.log(res, api+'response');
              if(!res.meta.success){
               this.singleton.ajaxSuccessFailHandler(res);
              }else{
                resolve(res);
              }
           },
            error => {
              this.singleton.hideLoader();
              console.log("Oooops!"+JSON.stringify(error));
            
           
              }
          );
      }
      
    });
  }


  scorePoint(data) {
    console.log(data, 'scorePoint Input Json');
    return new Promise((resolve, reject) => {
      this.api.post(this.singleton.updateCurrentGameScoreApi, data)
        .map(res => res.json())
        .subscribe(
          res => {
            console.log(res, 'scorePoint response');
            resolve(res);
          },
          err => {
            console.log(err, ' scorePoint error');
            }
        );
    });
  }


  showPromptOk(title, message, callback) {    
    console.log("promp provider");
    let prompt = this.alertCtrl.create({
       title: title || 'Alert!',
       message: message,
       buttons: [
         {
           text: 'YES',
           handler: data => {
             if(callback) callback("yes");
           }
         },
         {
          text: 'NO',
          handler: data => {
            if(callback) callback("no");
          }
        }
       ]
     });
     prompt.present();
   }



}
