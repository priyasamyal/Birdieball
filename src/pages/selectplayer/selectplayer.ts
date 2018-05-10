import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SingletonService } from '../../services/singleton/singleton';

import { SelectgamePage } from '../selectgame/selectgame';

@Component({
  selector: 'page-selectplayer',
  templateUrl: 'selectplayer.html'
})
export class SelectplayerPage {

  constructor(public navCtrl: NavController, public singleton: SingletonService) { }
     
  /**
  * Select player mode.
  */
  selectPlayerMode(mode){
       this.singleton.playerMode = mode;
       this.navCtrl.push(SelectgamePage);
  }

}
