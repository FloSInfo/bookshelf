import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';

@Component({
  selector: 'app-email-change',
  templateUrl: './email-change.component.html',
  styleUrls: ['./email-change.component.scss']
})
export class EmailChangeComponent {
  changeMailForm: FormGroup;
  isAuth = false;
  mail = '';
  mustReauthenticate = false;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userAlertService: UserAlertService,
    private router: Router) { }

  ngOnInit(): void {
    this.mail = this.authService.getMailAdress();
    this.initForm();
  }

  initForm() {
    this.changeMailForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]]
    });
  }

  async onMailSubmit() {

    if (this.mustReauthenticate) {
      try {
        await this.authService.reAuthenticateCurrentUser(this.changeMailForm.get('password').value);
      } catch (error) {
        if (error.code == 'auth/wrong-password') {
          this.userAlertService.alert('Le mot de passe renseigné n\'est pas le bon.');
          return;
        }
      }
    }

    var newMail = this.changeMailForm.get('email').value;
    let mailChangePromise = this.authService.changeUserEmail(newMail);

    mailChangePromise.then(
      () => {
        this.mail = newMail;
        this.userAlertService.alert('Adresse email modifiée. (Un lien permettant d\'annuler ce changement a été envoyé à votre ancienne adresse)', 12000);
        this.authService.forceUserUpdate();
        
      }).catch(
        (error) => {
          console.log(error);
          switch (error.code) {
            case 'auth/too-many-requests':
              this.userAlertService.alert('L\'accès à ce compte a été temporairement bloqué dû à un trop grand nombre de tentatives de connexion échouées. Restaurez votre accès en réinitialisant votre mot de passe.');
              break;
            case 'auth/user-not-found':
              this.userAlertService.alert('L\'adresse email renseignée ne correspond à aucun compte existant.');
              break;
            case 'auth/requires-recent-login':
              this.mustReauthenticate = true;
              this.userAlertService.alert('Cette action nécessite une authentification récente pour être validée, veuillez renseigner votre mot de passe pour continuer');
              this.changeMailForm.addControl('password', new FormControl('', { 'validators': [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)] }));
              break;
            default:
              this.userAlertService.alert(error.message);
          }
        }
      )
  }
}
