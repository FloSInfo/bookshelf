import { Injectable } from '@angular/core';
import firebase from '@firebase/app';
import "@firebase/auth";

@Injectable()
export class AuthService {

  constructor() { }

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
