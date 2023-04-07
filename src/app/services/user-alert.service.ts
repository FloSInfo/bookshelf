import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthError, AuthErrorCodes } from "@firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class UserAlertService {

  alertMessage = '';
  messageSubject = new Subject<string>();

  constructor() { }

  userAlert(message: string, time: number = 12000) {
    this.alertMessage = message;
    this.messageSubject.next(message);

    if (time > 0) {
      setTimeout(() => {
        this.messageSubject.next('');
      }, time);
    }
  }

  handleFirebaseAuthError(error: AuthError) {
    switch (error.code) {
      case AuthErrorCodes.CODE_EXPIRED:
        this.userAlert('Ce lien n\'est plus valide.');
        break;
      case AuthErrorCodes.EMAIL_EXISTS:
        this.userAlert('Cette adresse email est déjà utilisée.');
        break;
      case AuthErrorCodes.EXPIRED_OOB_CODE:
        this.userAlert('Ce lien de réinitialisation n\'est plus valide');
        break;
      case AuthErrorCodes.INVALID_CODE:
        this.userAlert('Ce lien est invalide ou a déjà été utilisé.');
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        this.userAlert('Format de l\'email fournit invalide');
        break;
      case AuthErrorCodes.INVALID_OOB_CODE:
        this.userAlert('Ce lien de réinitialisation est invalide ou a déjà été utilisé.');
        break;
      case AuthErrorCodes.INVALID_PASSWORD:
        this.userAlert('Le mot de passe renseigné n\'est pas le bon.');
        break;
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        this.userAlert('L\'accès à ce compte a été temporairement bloqué dû à un trop grand nombre de tentatives de connexion échouées. Restaurez votre accès en réinitialisant votre mot de passe ou attendez un peu avant de réessayer.');
        break;
      case AuthErrorCodes.USER_DELETED:
        this.userAlert('L\'adresse email renseignée ne correspond à aucun compte existant.');
        break;
      default:
        this.userAlert(error.message, 15000);
    }
  }

  clear() {
    this.messageSubject.next('');
  }
}
