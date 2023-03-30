import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-deletion',
  templateUrl: './account-deletion.component.html',
  styleUrls: ['./account-deletion.component.scss']
})
export class AccountDeletionComponent implements OnInit {

  userMail: string;
  deleteAccountForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userAlertService: UserAlertService,
    private router: Router){}

  ngOnInit(): void {
    this.userMail = this.authService.getMailAdress();
    this.initForm();
  }

  initForm() {
  	this.deleteAccountForm = this.formBuilder.group({
  		'password': ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
  	});
  }

  onSubmit() {
    const password = this.deleteAccountForm.get('password').value;

    this.authService.reAuthenticateCurrentUser(password).then(()=>{
      this.authService.removeCurrentUser().then(
        () => {
          this.userAlertService.alert('Suppression du compte réussie.', 10000);
        }
      ).catch((error) => {
        this.userAlertService.alert(error.message);
      });
    }).catch((error)=>{
      switch(error.code) {
        case 'auth/wrong-password':
          this.userAlertService.alert('Le mot de passe renseigné n\'est pas le bon.');
          break;
        default:
          this.userAlertService.alert(error.message);
      }
    });
  }
}
