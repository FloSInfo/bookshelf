import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

	signInForm: FormGroup;
	errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
  						private userAlertService: UserAlertService,
  						private router: Router) { }

  ngOnInit(): void {
  	this.initForm();
  }

  initForm() {
  	this.signInForm = this.formBuilder.group({
  		'email': ['', [Validators.required, Validators.email]],
  		'password': ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
  	});
  }

  onSubmit() {
  	const email = this.signInForm.get('email').value;
  	const password = this.signInForm.get('password').value;

  	this.authService.signInUser(email, password).then(
  		() => {
        if(this.errorMessage) {
          this.errorMessage = null;
          this.userAlertService.clear();
        }
  			this.router.navigate(['/books']);
  		}
  	).catch(
  		(error) => {
        switch(error.code) {
          case 'auth/too-many-requests':
            this.userAlertService.alert('L\'accès à ce compte a été temporairement bloqué dû à un trop grand nombre de tentatives de connexion échouées. Restaurez votre accès en réinitialisant votre mot de passe.');
            break;
          case 'auth/wrong-password':
            this.userAlertService.alert('Le mot de passe renseigné n\'est pas le bon.');
            break;
          case 'auth/user-not-found':
            this.userAlertService.alert('L\'adresse email renseignée ne correspond à aucun compte existant.');
            break;
          default:
            this.userAlertService.alert(error.message);
        }
  			this.errorMessage = error;
  		}
  	);
  }

}
