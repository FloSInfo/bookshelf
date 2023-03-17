import { Component } from '@angular/core';
import { initializeApp } from '@firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bookshelf';
  app;

  constructor() {
  	var firebaseConfig = {
	    apiKey: "AIzaSyCXp6NsKZzAvTjLy0Xat0j74pmPPxG5F_Q",
	    authDomain: "bookshelf-fe059.firebaseapp.com",
	    databaseURL: "https://bookshelf-fe059.firebaseio.com",
	    projectId: "bookshelf-fe059",
	    storageBucket: "bookshelf-fe059.appspot.com",
	    messagingSenderId: "13935821248",
	    appId: "1:13935821248:web:2379118a1cda6b15cd0825"
	  };
  	// Initialize Firebase
  	initializeApp(firebaseConfig);
  }
}
