import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import firebase from '@firebase/app';
import "firebase/auth";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	isAuth: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  	firebase.auth().onAuthStateChanged(
  		(user) => {
  			if(user) {
  				this.isAuth = true;
  			}
  			else {
  				this.isAuth = false;
  			}
  		}
  	);
  }

  onSignOut() {
  	this.authService.signOutUser();
  }

}
