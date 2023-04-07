import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Auth, getAuth, verifyPasswordResetCode, reload, checkActionCode, applyActionCode, ActionCodeInfo, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, confirmPasswordReset, updateEmail, onAuthStateChanged, User } from "@firebase/auth";

@Injectable()
export class AuthService {

  auth: Auth;
  authStateUnsub: Function;
  authSubject = new Subject<User | Error>();

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

  forceLocalUpdate() {
    this.authSubject.next(this.auth.currentUser);
  }

  reloadUser() {
    return reload(this.auth.currentUser);
  }

  mailPswReauthentication(email: string, password: string) {
    let credential = EmailAuthProvider.credential(email, password);
    return reauthenticateWithCredential(this.auth.currentUser, credential);
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

  verifyPswResetCode(oobCode: string) {
    return verifyPasswordResetCode(this.auth, oobCode);
  }

  checkCode(oobCode: string): Promise<ActionCodeInfo> {
    return checkActionCode(this.auth, oobCode);
  }

  applyCode(oobCode: string) {
    return applyActionCode(this.auth, oobCode);
  }

  resetPassword(oobCode: string, newPassword: string) {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }

  changeUserEmail(newMail: string) {
    return updateEmail(this.auth.currentUser, newMail);
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