import { Injectable } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { Subject } from 'rxjs';
import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/storage';

@Injectable()
export class BooksService {

	books: Book[] = [];
	booksSubject = new Subject<Book[]>();

  constructor() {}

  emitBooks() {
  	this.booksSubject.next(this.books);
  }

  saveBooks(userId) {
  	firebase.database().ref('/users/'+userId+'/books').set(this.books);
  }

  getBooks(userId) {
    if(userId) {
      firebase.database().ref('/users/'+userId+'/books').on('value',
        (snapshot) => {
          this.books = snapshot.val() ? snapshot.val() : [];
          this.emitBooks();
        }
      );
    }
  }

  getSingleBook(userId, bookId: number) {
  	return new Promise(
  		(resolve, reject) => {
  			firebase.database().ref('/users/'+userId+'/books/'+bookId).once('value').then(
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

  createNewBook( userId, newBook: Book){
  	this.books.push(newBook);
  	this.saveBooks(userId);
  }

  removeBook(userId, book: Book){
  	const bookIndex = this.books.findIndex(
			(elem) => {
				return elem === book;
			}
		);

		this.books.splice(bookIndex, 1);
		this.saveBooks(userId);
		if(book.photo){
			firebase.storage().refFromURL(book.photo).delete()
			.then(
				() => console.log('Book\'s photo removed')
			).catch(
				err => console.log('error on book\'s photo removal: '+err)
			);
		}
  }

  uploadImage(file: File) {
  	return new Promise(
  		(resolve, reject) => {
  			const almostUniqueFileName = Date.now().toString(); //timestamp
  			var upload = firebase.storage().ref().child('books_photo/'+almostUniqueFileName+file.name).put(file);
  			let unsubscribe = upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
  				(snapshot) => {
  					console.log('Image uploading ('+snapshot.bytesTransferred+'/'+snapshot.totalBytes+' bytes');
  				},
  				(err) => {
  					console.log('Error while uploading image: '+err);
  					unsubscribe();//use the function returned by UploadTask.on() to unsubscribe callbacks from the event
  				},
  				() => {
  					console.log('Image\'s upload complete');
  					unsubscribe();
  					resolve(upload.snapshot.ref.getDownloadURL());
  				}
  			);
  		}
  	);
  }
}
