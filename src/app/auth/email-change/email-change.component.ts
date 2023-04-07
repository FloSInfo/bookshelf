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
        this.userAlertService.handleFirebaseAuthError(error);
        return;
      }
    }

    var newMail = this.changeMailForm.get('email').value;
    let mailChangePromise = this.authService.changeUserEmail(newMail);

    mailChangePromise.then(
      () => {
        this.mail = newMail;
        this.userAlertService.userAlert('Adresse email modifiée. (Un lien permettant d\'annuler ce changement a été envoyé à votre ancienne adresse)', 12000);
        this.authService.forceLocalUpdate();
        this.router.navigate(['books']);
      }).catch(
        (error) => {
          if (error.code === 'auth/requires-recent-login') {
            this.mustReauthenticate = true;
            this.userAlertService.userAlert('Cette action nécessite une authentification récente pour être validée, veuillez renseigner votre mot de passe pour continuer');
            this.changeMailForm.addControl('password', new FormControl('', { 'validators': [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)] }));
          }
          else {
            this.userAlertService.handleFirebaseAuthError(error);
          }
        }
      );
  }
}
