import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  resetPasswordForm: FormGroup;
  authStateSubscription: Subscription;
  isAuth = false;
  mail = '';
  
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userAlertService: UserAlertService,
    private router: Router) { }

    ngOnInit(): void {
      this.isAuth = this.authService.isConnected();
      if (this.isAuth){
        this.mail = this.authService.getMailAdress();
      }
      this.authStateSubscription = this.authService.authSubject.subscribe(
        (user) => {
          if(user) {
            this.isAuth = true;
            // @ts-ignore
            this.mail = user.providerData[0].email;
          }
          else {
            this.isAuth = false;
          }
        },
        () => {
          this.isAuth = false;
        }
      );

      this.initForm();
    }

    initForm() {
      this.resetPasswordForm = this.formBuilder.group({
        'email': ['', [Validators.required, Validators.email]],
      });
    }

    onMailSubmit() {
      const email = this.resetPasswordForm.get('email').value;

      this.authService.sendPasswordResetCode(email).then(
        () => {
          this.userAlertService.alert('Le lien de réinitialisation du mot de passe a été envoyé à l\'adresse indiqué');
        }
      ).catch((error) => {
        switch(error.code) {
          case 'auth/too-many-requests':
            this.userAlertService.alert('L\'accès à ce compte a été temporairement bloqué dû à un trop grand nombre de tentatives de connexion échouées. Restaurez votre accès en réinitialisant votre mot de passe.');
            break;
          case 'auth/user-not-found':
            this.userAlertService.alert('L\'adresse email renseignée ne correspond à aucun compte existant.');
            break;
          default:
            this.userAlertService.alert(error.message);
        }
      });
    }

}
