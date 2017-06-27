import { Signin } from './../pages/signin/signin';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './../providers/auth.service';
import { FirebaseAuthState } from 'angularfire2';
import { User } from './../models/user.model';
import { UserService } from './../providers/user.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = Signin;

  currentUser: User;

  constructor(
    authService: AuthService,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    userService: UserService

  ) {

    authService
      .auth
      .subscribe((authState: FirebaseAuthState) => {

        if (authState) {
          userService.currentUser.subscribe((user: User) => {
            this.currentUser = user;
          });
        }
      });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

