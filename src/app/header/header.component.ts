import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { Subscription } from 'rxjs';
import { Button } from 'protractor';

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
        if (user) this.isAuth = true;
        else this.isAuth = false;
      },
      () => this.isAuth = false
    );

    this.userAlertService.messageSubject.subscribe(
      (x) => {
        if (typeof x === 'string' && x.length > 0) {
          this.displayUserAlert(x);
        }
        else {
          if (this.userAlert != '') {
            this.hideUserAlert();
          }
        }
      }
    );
  }

  onParamClick(event) {
    let anim = document.getElementById('paramRotation');
    if (event.currentTarget.getAttribute('aria-expanded') === 'false') {
      // @ts-expect-error
      anim.beginElement();
    }
  }

  displayUserAlert(x) {
    this.userAlert = x;
    document.getElementById('userAlert').innerHTML = x;
  }

  hideUserAlert() {
    this.userAlert = '';
    document.getElementById('userAlert').innerHTML = '';
  }

  onSignOut(event) {
    event.preventDefault();
    this.authService.signOutUser();
  }

  onDeleteAccount(event) {
    event.preventDefault();
    if (window.confirm('Vous êtes sur le point de supprimer définitivement votre compte utilisateur ainsi que les données liées.')) {
      try {
        this.authService.removeCurrentUser().then(
          () => {
            this.userAlertService.alert('Compte supprimé avec succès', 15000);
          }
        ).catch();
      }
      catch (error) {
        this.userAlertService.alert(error.message);
      }
    }
  }
}
