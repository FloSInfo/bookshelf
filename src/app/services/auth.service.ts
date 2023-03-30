import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, onAuthStateChanged, User} from "@firebase/auth";

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

  getMailAdress() {
    return this.auth.currentUser.providerData[0].email;
  }

  isConnected() {
    return this.auth.currentUser != null;
  }

  sendPasswordResetCode(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  createNewUser(email: string, password: string) {
  	return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInUser(email: string, password: string) {
  	return signInWithEmailAndPassword(this.auth, email, password);
  }

  reAuthenticateCurrentUser(password: string) {
    const credential = EmailAuthProvider.credential(this.auth.currentUser.providerData[0].email, password);
    return reauthenticateWithCredential(this.auth.currentUser, credential);
  }

  removeCurrentUser() {
    return deleteUser(this.auth.currentUser);
  }

  signOutUser() {
  	this.auth.signOut();
  }
}