
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FirebaseListObservable, AngularFire } from 'angularfire2';

import { Message } from "../models/message.model";
import { BaseService } from "./base.service";
//import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class MessageService extends BaseService {

  //private limit: BehaviorSubject<number> = new BehaviorSubject<number>(20);

  constructor(
    public af: AngularFire,
    public http: Http

  ) {
    super();
  }

  create(message: Message, listMessages: FirebaseListObservable<Message[]>): Promise<void> {
    return listMessages.push(message)
      .catch(this.handlePromiseError);
  }

  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {

    return <FirebaseListObservable<Message[]>>this.af.database.list(`/messages/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 20
      }
    }).catch(this.handleObservableError);

  }

   /*getMoreData(userId1: string, userId2: string): FirebaseListObservable<Message[]> {
     this.limit.next(this.limit.getValue()+20);

    return <FirebaseListObservable<Message[]>>this.af.database.list(`/messages/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: this.limit
      }
    }).catch(this.handleObservableError);

  }*/



}
