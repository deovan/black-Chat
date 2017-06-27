import { User } from './../../models/user.model';
import { MenuController, App, AlertController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

import { AuthService } from './../../providers/auth.service';

import { BaseComponent } from "../base.component";
import { UserProfilePage } from './../../pages/user-profile/user-profile';
@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.component.html'
})
export class UserMenuComponent extends BaseComponent {
  @Input('user') currentUser : User;
  @Input('isMenu')isMenu: boolean;


  constructor(
      public alertCtrl: AlertController,
        public authService: AuthService,
        public app: App,
        public menuCtrl: MenuController
  ) {
    super(alertCtrl,authService,app,menuCtrl);

  }

  onProfile(): void{
    this.navCtrl.push(UserProfilePage);

  }

}
