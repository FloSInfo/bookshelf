import { Injectable } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { Subject } from 'rxjs';
import { Database, getDatabase, ref as dbref, set, get, onValue } from '@firebase/database';
import { FirebaseStorage, getStorage, ref as storeref, uploadBytesResumable, getDownloadURL, TaskEvent, deleteObject } from '@firebase/storage';

@Injectable()
export class BooksService {

	database: Database;
	storage: FirebaseStorage;
	books: Book[] = [];
	booksSubject = new Subject<Book[]>();

  constructor() {
  	this.database = getDatabase();
  	this.storage = getStorage();
  }

  emitBooks() {
  	this.booksSubject.next(this.books);
  }

  saveBooks(userId) {
  	set(dbref(this.database, '/users/'+userId+'/books'), this.books);
  }

  getBooks(userId) {
  	onValue(dbref(this.database, '/users/'+userId+'/books'),
  		(snapshot) => {
  			this.books = snapshot.val() ? snapshot.val() : [];
  			let i = 0;
  			this.books.forEach(elem => elem.id = i++);
  			this.emitBooks();
  		}
  	);
  }

  getSingleBook(userId, bookId: number) {
  	return new Promise(
  		(resolve, reject) => {
  			get(dbref(this.database, '/users/'+userId+'/books/'+bookId)).then(
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

  createNewBook(userId, newBook: Book){
  	this.books.push(newBook);
  	this.saveBooks(userId);
  }

  removeBook(userId, book: Book){
  	var bookIndex = new Promise(
  		(resolve, reject) => {
  			let	index = -1;

		  	for(let i = 0; i < this.books.length; i++){
					if(book.id === this.books[i].id) {
						index = i;
						break;
					}
				}
				resolve(index);
  		}
  	);

  	bookIndex.then(
  		(index:number) => {
				this.books.splice(index, 1);
				this.saveBooks(userId);
			}
		);
		
		if(book.photo){
			deleteObject(storeref(this.storage, book.photo))
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
  			var upload = uploadBytesResumable(storeref(getStorage(), 'books_photo/'+almostUniqueFileName+file.name),file);
  			let unsubscribe = upload.on('state_changed',
  				(snapshot) => {
  					console.log('Image uploading ('+snapshot.bytesTransferred+'/'+snapshot.totalBytes+' bytes)');
  				},
  				(err) => {
  					console.log('Error while uploading image: '+err);
  					unsubscribe();//use the function returned by UploadTask.on() to unsubscribe callbacks from the event
  				},
  				() => {
  					console.log('Image\'s upload complete');
  					unsubscribe();
  					resolve(getDownloadURL(upload.snapshot.ref));
  				}
  			);
  		}
  	);
  }
}
