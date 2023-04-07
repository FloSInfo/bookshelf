/*Handle password and mail reset requests made through links sent to the users using the firebase authentication module */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionCodeOperation } from '@firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-link',
  templateUrl: './email-link.component.html',
  styleUrls: ['./email-link.component.scss']
})
export class EmailLinkComponent implements OnInit {

  resetPsw = false;
  revertMailUpdate = false;
  oobCode = '';
  newPasswordForm: FormGroup;
  formerMail = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userAlertService: UserAlertService,
    private router: Router){}

  ngOnInit(): void {
    const url = this.router.parseUrl(this.router.url);

    if (url.queryParams.mode === 'resetPassword' && url.queryParams.oobCode) {
      this.oobCode = url.queryParams.oobCode;
      this.authService.verifyPswResetCode(this.oobCode).then(
        () => {
          this.initForm();
          this.resetPsw = true;
        }
      ).catch((error) => {
        this.userAlertService.handleFirebaseAuthError(error);
        this.router.navigate(['books']);
      });
    }
    else if (url.queryParams.mode === 'recoverEmail' && url.queryParams.oobCode) {
      this.oobCode = url.queryParams.oobCode;
      this.authService.checkCode(this.oobCode).then(
        (codeInfos) => {
          if(codeInfos.operation === ActionCodeOperation.RECOVER_EMAIL){
            this.revertMailUpdate = true;
            this.formerMail = codeInfos.data.email;
          }
          else {
            this.userAlertService.userAlert('Le code de réinitialisation fournit est érroné', 10000);
            this.router.navigate(['books']);
          }
        }
      ).catch((error) => {
        this.userAlertService.handleFirebaseAuthError(error);
        this.router.navigate(['books']);
      }); 
    }
  }

  initForm() {
    this.newPasswordForm = this.formBuilder.group({
      'newPassword': ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }
  
  onPasswordSubmit() {
    const password = this.newPasswordForm.get('newPassword').value;

    this.authService.resetPassword(this.oobCode, password).then(
      () => {
        this.userAlertService.userAlert('Votre mot de passe a été modifié.', 10000);
        this.router.navigate(['books']);
      }
    ).catch((error) => {
      this.userAlertService.handleFirebaseAuthError(error);
    });
  }

  onEmailRevert() {
    this.authService.applyCode(this.oobCode).then(
      () => {
        this.userAlertService.userAlert('Le changement d\'adresse email a bien été annulé. Veuillez vous réauthentifier.', -1);
        this.authService.reloadUser().catch((error)=>{console.log(error.message)});
        this.router.navigate(['auth','signin'], { queryParams: { 'email': this.formerMail} });
      }
    ).catch(
      (error) => {
        this.userAlertService.handleFirebaseAuthError(error);
      }
    );
  }
}