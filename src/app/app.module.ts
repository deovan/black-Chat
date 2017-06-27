import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AuthService } from './../providers/auth.service';
import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { Chat } from './../pages/chat/chat';
import { ChatService } from './../providers/chat.service';
import { CustomLoggedHeaderComponent } from './../components/custom-logged-header/custom-logged-header.component';
import { HomePage } from '../pages/home/home';
import { MyApp } from './app.component';
import { MessageBoxComponent } from './../components/message-box/message-box.component';
import { ProgressBarComponent } from './../components/progress-bar/progress-bar.component';
import { Signin } from './../pages/signin/signin';
import { Signup } from './../pages/signup/signup';
import { UserInfoComponent } from './../components/user-info/user-info.component';
import { UserMenuComponent } from './../components/user-menu/user-menu.component';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { UserService } from './../providers/user.service';
import { HttpModule } from "@angular/http";
import { MessageService } from "../providers/message.service";

const fireBaseAppConfig = {
  apiKey: "AIzaSyC1znTaAiK4Zy9q60gRCB6ytaOaO-yZvBg",
  authDomain: "ionic2-firebase-chat-42f49.firebaseapp.com",
  databaseURL: "https://ionic2-firebase-chat-42f49.firebaseio.com",
  storageBucket: "ionic2-firebase-chat-42f49.appspot.com",
  messagingSenderId: "806046798200"
};

const firebaseAuthConfig = {
  provide: AuthProviders.Custom,
  method: AuthMethods.Password
}


@NgModule({
  declarations: [
    CapitalizePipe,
    Chat,
    CustomLoggedHeaderComponent,
    HomePage,
    MessageBoxComponent,
    MyApp,
    ProgressBarComponent,
    Signin,
    Signup,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage
  ],
  imports: [
    AngularFireModule.initializeApp(fireBaseAppConfig, firebaseAuthConfig),
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Chat,
    HomePage,
    MyApp,
    Signin,
    Signup,
    UserProfilePage
  ],
  providers: [
    AuthService,
    ChatService,
    MessageService,
    StatusBar,
    SplashScreen,
    UserService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
