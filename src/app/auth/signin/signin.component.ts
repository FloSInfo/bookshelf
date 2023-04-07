import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

	signInForm: FormGroup;
	errorMessage: string;
	queryParamsSubscription: Subscription;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private userAlertService: UserAlertService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.signInForm = this.formBuilder.group({
			'email': ['', [Validators.required, Validators.email]],
			'password': ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
		});

		this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
			this.signInForm.get('email').setValue(params['email']);
		});
	}

	onSubmit() {
		const email = this.signInForm.get('email').value;
		const password = this.signInForm.get('password').value;

		this.authService.signInUser(email, password).then(
			() => {
				if (this.errorMessage) {
					this.errorMessage = null;
					this.userAlertService.clear();
				}
				this.userAlertService.clear();
				this.queryParamsSubscription.unsubscribe();
				this.router.navigate(['/books']);
			}
		).catch(
			(error) => {
				this.userAlertService.handleFirebaseAuthError(error);
			}
		);
	}

}
