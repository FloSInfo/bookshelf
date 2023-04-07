import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

	signupForm: FormGroup;
	errorMessage: string;
  passwordElem: HTMLElement;
  passwordInfo: HTMLElement;

  constructor(private formBuilder: FormBuilder,
  						private authService: AuthService,
              private userAlertService: UserAlertService,
  						private router: Router) { }

  ngOnInit(): void {
  	this.initForm();
    this.passwordElem = document.getElementById('password');
    this.passwordInfo = document.getElementById('passwordInfo');
    this.passwordElem.addEventListener("blur", ()=>(this.onPasswordBlur()));
  }

  initForm() {
  	this.signupForm = this.formBuilder.group({
  		'email': ['', [Validators.required, Validators.email]],
  		'password': ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
  	});
  }

  onPasswordBlur() {
    let passwordForm = this.signupForm.get('password');
    if(passwordForm.invalid && passwordForm.dirty){
      if(this.passwordInfo.style.display === ""){
        this.passwordInfo.style.display = "block";
      }
    }
    else if(this.passwordInfo.style.display === "block") {
      this.passwordInfo.style.display = "";
    }
  }

  onSubmit() {
  	const email = this.signupForm.get('email').value;
  	const password = this.signupForm.get('password').value;

  	this.authService.createNewUser(email, password).then(
  		() => {
        this.userAlertService.clear();
  			this.router.navigate(['/books']);
  		}
  	).catch(
  		(error) => {
  			this.userAlertService.handleFirebaseAuthError(error);
  		}
  	);
  }
}
