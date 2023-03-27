import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAlertService {

  alertMessage ='';
  messageSubject = new Subject<string>();

  constructor() { }

  alert(message: string, time: number = -1){
    this.alertMessage = message;
    this.messageSubject.next(message);

    if(time > 0){
      setTimeout(() => {
        this.messageSubject.next('');
      }, time);
    }
  }

  clear() {
    this.messageSubject.next('');
  }
}
