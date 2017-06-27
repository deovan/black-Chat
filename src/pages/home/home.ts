
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';
import { UserService } from './../../providers/user.service';
import { Chat } from './../chat/chat';
import { ChatService } from './../../providers/chat.service';
import { FirebaseListObservable } from 'angularfire2';
import { User } from './../../models/user.model';
import { Signup } from './../signup/signup';
import firebase from 'firebase';

import { ChatModel } from './../../models/chat.model';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  chats: FirebaseListObservable<ChatModel[]>;
  users: FirebaseListObservable<User[]>;
  view: string = 'chats';
  constructor(
    public authService: AuthService,
    public chatService: ChatService,
    public menuCtrl: MenuController,
    public userService: UserService,
    public navCtrl: NavController
  ) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.chats = this.chatService.chats;
    this.users = this.userService.users;
    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any):void{
    let searchTerm: string =  event.target.value;

    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    if (searchTerm){
      switch(this.view){

        case 'chats':
          this.chats = <FirebaseListObservable<ChatModel[]>>this.chats
          .map((chats: ChatModel[])=>{

              return chats.filter((chat: ChatModel)=>{
                  return (chat.title.toLowerCase().indexOf(searchTerm.toLowerCase())> -1);
              });
          });

          break;

        case 'users':
          this.users =<FirebaseListObservable<User[]>> this.users
          .map((users : User[])=>{

              return users.filter((user: User)=>{
                  return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase())>-1);
              });
          });
          break;
      }
    }

  }



  onChatCreate(recipientUser: User): void {

    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {

        this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)
          .first()
          .subscribe((chat: ChatModel) => {

            if (chat.hasOwnProperty('$value')) {
              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1 = new ChatModel('', timestamp, recipientUser.name, '');
              this.chatService.create(chat1, currentUser.$key, recipientUser.$key);


              let chat2 = new ChatModel('', timestamp, currentUser.name, '');
              this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
            }

          });
      });

    this.navCtrl.push(Chat, {
      recipientUser: recipientUser
    });

  }

  onChatOpen(chat: ChatModel): void {

    let recipientUserId: string = chat.$key;

    this.userService.getUser(recipientUserId)
      .first()
      .subscribe((user: User) => {

        this.navCtrl.push(Chat, {
          recipientUser: user
        });

      });

  }
  onSignup(): void {
    this.navCtrl.push(Signup);
  }



}
