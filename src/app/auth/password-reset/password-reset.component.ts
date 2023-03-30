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
      this.authService.authSubject.subscribe(
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
        () => this.isAuth = false
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
        console.log(error);
      });
    }

}
