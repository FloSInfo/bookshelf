import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { Router } from '@angular/router';
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
  username = '';
  menuExpanded = false;

  constructor(private authService: AuthService,
    private userAlertService: UserAlertService,
    private router: Router) { }

  ngOnInit(): void {
    this.authService.authSubject.subscribe(
      (user) => {
        if (user) {
          this.isAuth = true;
          // @ts-ignore
          this.username = user.providerData[0].email;
        }
        else {
          this.isAuth = false;
        }
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

  //play parameters menu svg's animation when clicked
  onParamClick(event) {
    let anim = event.currentTarget.getElementsByClassName('paramRotation')[0];
    if (event.currentTarget.getAttribute('aria-expanded') === 'false') {
      anim.beginElement();
    }
  }

  onMobileMenuExpand(event) {
    var menu = document.getElementById('mobile-param-menu');
    var onBodyClick = (event) => {
      menu.className = '';
    };
    menu.className = (menu.className == 'show')?'':'show';
    event.stopPropagation();
    document.body.addEventListener('click', onBodyClick, { once: true });
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
      this.authService.removeCurrentUser().then(
        () => {
          this.userAlertService.alert('Suppression du compte réussie.', 15000);
        }
      ).catch((error) => {
        switch (error.code) {
          case 'auth/requires-recent-login':
            this.userAlertService.alert('Cette action nécessite une authentification récente pour être validée, veuillez vous ré-authentifier pour continuer');
            this.router.navigate(['/auth', 'deleteAccount']);
            break;
          default:
            this.userAlertService.alert(error.message);
        }
      });
    }
  }
}
