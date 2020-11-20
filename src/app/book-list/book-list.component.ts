import { Component, OnInit, OnDestroy } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { Book } from 'src/app/models/book.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy{

	booksSubscription: Subscription;
	booksList: Book[] = [];

  constructor(private booksService: BooksService,
  						private router: Router) { }

  ngOnInit(): void {
  	this.booksSubscription = this.booksService.booksSubject.subscribe(
  		value => this.booksList = value,
  		err => console.log('book-list.booksSubscription.next(): '+err)
  	);
  	this.booksService.emitBooks();
  }

  onViewBook(index: number){
  	if(this.booksList[index]) {
  		this.router.navigate(['books', 'view', index]);
  	}
  }

  onDeleteBook(book: Book){
  	this.booksService.removeBook(book);
  }

  onNewBook(){
  	this.router.navigate(['books','new']);
  }

  ngOnDestroy(): void {
  	this.booksSubscription.unsubscribe();
  }
}
