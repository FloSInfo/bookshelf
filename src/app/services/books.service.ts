import { Injectable } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { Subject } from 'rxjs';
import firebase from '@firebase/app';
import '@firebase/database';

@Injectable()
export class BooksService {

	books: Book[] = [];
	booksSubject = new Subject<Book[]>();

  constructor() {
  	this.getBooks();
  }

  emitBooks() {
  	this.booksSubject.next(this.books);
  }

  saveBooks() {
  	firebase.database().ref('/books').set(this.books);
  }

  getBooks() {
  	firebase.database().ref('/books').on('value',
  		(snapshot) => {
  			this.books = snapshot.val() ? snapshot.val() : [];
  			this.emitBooks();
  		}
  	);
  }

  getSingleBook(id: number) {
  	return new Promise(
  		(resolve, reject) => {
  			firebase.database().ref('/books/'+id).once('value').then(
  				(data) => {
  					resolve(data.val());
  				},
  				(error) => {
  					reject(error);
  				}
  			);
  		}
  	);
  }

  createNewBook(newBook: Book){
  	this.books.push(newBook);
  	this.saveBooks();
  }

  removeBook(book: Book){
  	const bookIndex = this.books.findIndex(
			(elem) => {
				return elem === book;
			}
		);

		this.books.splice(bookIndex, 1);
		this.saveBooks();
  }
}
