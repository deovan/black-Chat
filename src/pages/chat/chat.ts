//import { InfiniteScroll } from 'ionic-angular';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { NavController, NavParams, Content } from 'ionic-angular';

import { ChatService } from './../../providers/chat.service';
import { ChatModel } from './../../models/chat.model';
import { UserService } from './../../providers/user.service';
import { Component, ViewChild } from '@angular/core';
import { AuthService } from './../../providers/auth.service';
import { Message } from './../../models/message.model';
import { User } from "../../models/user.model";

import { MessageService } from './../../providers/message.service';
import firebase from 'firebase';
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {

  // @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  // items: number[] = [];

  @ViewChild(Content) content: Content;

  messages: FirebaseListObservable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  private chat1: FirebaseObjectObservable<ChatModel>;
  private chat2: FirebaseObjectObservable<ChatModel>;

  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public messageService: MessageService,
    public chatService: ChatService
  ) {

    //  this.items.unshift(this.items.length);

  }
  /*
    doInfinite(infiniteScroll: InfiniteScroll) {
  
      this.messageService.getMoreData(this.recipient.$key,this.sender.$key);
      infiniteScroll.complete();
  
    }*/
  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.sender = currentUser;

        this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);
        this.chat2 = this.chatService.getDeepChat(this.recipient.$key, this.sender.$key);

        if (this.recipient.photo){
          this.chat1
            .first()
            .subscribe((chat: ChatModel) => {
              this.chatService.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
            });
        }
      
       

        let doSubScription = () => {
        this.messages
          .subscribe((messages: Message[]) => {
            this.scrollToBotton();
          });
      }
        this.messages = this.messageService
        .getMessages(this.sender.$key, this.recipient.$key);

    this.messages
      .first()
      .subscribe((messages: Message[]) => {
        if (messages.length === 0) {
          this.messages = this.messageService
            .getMessages(this.recipient.$key, this.sender.$key);
          doSubScription();
        } else {
          doSubScription();
        }
      });
  });
}


sendMessage(newMessage: string): void {
  if(newMessage) {
    let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;

    this.messageService.create(
      new Message(
        this.sender.$key,
        newMessage,
        currentTimestamp
      ),
      this.messages
    ).then(() => {

      this.chat1
        .update({
          lastMessage: newMessage,
          timestamp: currentTimestamp
        });

      this.chat2
        .update({
          lastMessage: newMessage,
          timestamp: currentTimestamp
        });

    });
  }
}



  private scrollToBotton(duration ?: number): void {
  setTimeout(() => {
  if (this.content) {
    this.content.scrollToBottom(duration || 300);
  }
}, 50);


  }
}
