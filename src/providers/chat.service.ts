import { FirebaseListObservable } from 'angularfire2';
import { FirebaseAuthState } from 'angularfire2';
import { FirebaseObjectObservable } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire } from 'angularfire2';
import { BaseService } from "./base.service";
import { ChatModel } from './../models/chat.model';

@Injectable()
export class ChatService extends BaseService {

  chats: FirebaseListObservable<ChatModel[]>;

  constructor(
    public af: AngularFire,
    public http: Http) {
    super();
    this.setChats();
  }


  private setChats(): void {
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {

        if (authState) {
          this.chats = <FirebaseListObservable<ChatModel[]>>this.af.database.list(`/chats/${authState.auth.uid}`, {
            query: {
              orderByChild: 'timestamp'
            }

          }).map((chats: ChatModel[]) => {
            return chats.reverse();
          }).catch(this.handleObservableError);


        }

      });
  }

  create(chat: ChatModel, userId1: string, userId2: string): firebase.Promise<void> {
    return this.af.database.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<ChatModel> {
    return <FirebaseObjectObservable<ChatModel>>this.af.database.object(`/chats/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }

updatePhoto(chat: FirebaseObjectObservable<ChatModel>,
chatPhoto: string, recipientUserPhoto: string  )
: firebase.Promise<boolean>{

  if(chatPhoto != recipientUserPhoto){
  return chat.update({
    photo: recipientUserPhoto
  }).then(()=>{
    return true;
  }).catch(this.handlePromiseError);
  
}
 return Promise.resolve(false);
}
}
