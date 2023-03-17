import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, onAuthStateChanged, User} from "@firebase/auth";

@Injectable()
export class AuthService {

  auth: Auth;
  authStateUnsub: Function;
  authSubject = new Subject<User|Error>();

  constructor() { 
    this.auth = getAuth();
    this.authStateUnsub = onAuthStateChanged(this.auth,
      (user) => this.authSubject.next(user),
      (authError) => this.authSubject.error(authError)
    );
  }

  getUid() {
    return this.auth.currentUser.uid;
  }

  getUid() {
    return firebase.auth().currentUser.uid;
  }

  createNewUser(email: string, password: string) {
  	return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInUser(email: string, password: string) {
  	return signInWithEmailAndPassword(this.auth, email, password);
  }

  removeCurrentUser() {
    return deleteUser(this.auth.currentUser);
  }

  signOutUser() {
  	this.auth.signOut();
  }
}
