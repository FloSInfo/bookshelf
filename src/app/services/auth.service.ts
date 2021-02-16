import { Injectable } from '@angular/core';
import firebase from '@firebase/app';
import "@firebase/auth";
import "@firebase/database";

@Injectable()
export class AuthService {

  constructor() { }

  getUid() {
    return firebase.auth().currentUser.uid;
  }

  createNewUser(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signInUser(email: string, password: string) {
  	return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signOutUser() {
  	firebase.auth().signOut();
  }
}
