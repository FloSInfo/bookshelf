import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BooksService } from 'src/app/services/books.service';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

	bookForm: FormGroup;

  constructor(private booksService: BooksService,
  						private router: Router,
  						private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  	this.initForm();
  }

  initForm() {
  	this.bookForm = this.formBuilder.group(
  		{
  			'title': ['', [Validators.required, Validators.minLength(2)]],
  			'author': ['', [Validators.required, Validators.minLength(2)]],
  			'synopsis': ''
  		}
  	);
  }

  onSubmit(form){
  	if(form.valid){
  		let newBook = new Book(form.value.title, form.value.author);

  		if(form.value.synopsis) {
  			newBook.synopsis = form.value.synopsis;
  		}

  		this.booksService.createNewBook(newBook);
  		this.router.navigate(['/books']);
  	}
  }
}
