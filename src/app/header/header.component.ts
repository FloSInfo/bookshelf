import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	isAuth: boolean;
  authStateSubscription: Subscription;
  userAlertServiceSubscription: Subscription;
  userAlert = '';

  constructor(private authService: AuthService,
              private userAlertService: UserAlertService) { }

  ngOnInit(): void {
  	this.authService.authSubject.subscribe(
      (user) => {
        if(user) this.isAuth = true;
        else this.isAuth = false;
      },
      () => this.isAuth = false
    );

    this.userAlertService.messageSubject.subscribe(
      (x) => {
        if(typeof x === 'string' && x.length > 0) {
          this.displayUserAlert(x);
        }
        else {
          if(this.userAlert != ''){
            this.hideUserAlert();
          }
        }
      }
    );
  }

  displayUserAlert(x) {
    this.userAlert = x;
    document.getElementById('userAlert').innerHTML = x;
  }

  hideUserAlert() {
    this.userAlert = '';
    document.getElementById('userAlert').innerHTML = '';
  }

  onSignOut() {
  	this.authService.signOutUser();
  }
}
