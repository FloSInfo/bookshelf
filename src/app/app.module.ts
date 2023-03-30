import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { BookListComponent } from './book-list/book-list.component';
import { SingleBookComponent } from './book-list/single-book/single-book.component';
import { BookFormComponent } from './book-list/book-form/book-form.component';
import { HeaderComponent } from './header/header.component';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { BooksService } from './services/books.service';
import { UserAlertService } from 'src/app/services/user-alert.service';
import { AccountDeletionComponent } from './auth/account-deletion/account-deletion.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    BookListComponent,
    SingleBookComponent,
    BookFormComponent,
    HeaderComponent,
    AccountDeletionComponent,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'auth/signup', component: SignupComponent },
      { path: 'auth/signin', component: SigninComponent },
      { path: 'auth/resetPassword', component: PasswordResetComponent },
      { path: 'auth/deleteAccount', canActivate: [AuthGuardService], component: AccountDeletionComponent },
      { path: 'books', canActivate: [AuthGuardService], component: BookListComponent },
      { path: 'books/new', canActivate: [AuthGuardService], component: BookFormComponent },
      { path: 'books/view/:id', canActivate: [AuthGuardService], component: SingleBookComponent },
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      { path: '**', redirectTo: 'books' }
    ])
  ],
  providers: [
  	AuthService,
  	AuthGuardService,
  	BooksService,
    UserAlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
