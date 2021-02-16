import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent implements OnInit {

	book: Book;

  constructor(private booksService: BooksService,
  						private router: Router,
  						private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
  	this.route.params.subscribe(
  		params => {
  			if(typeof params.id !== 'undefined'){
		  		this.booksService.getSingleBook(this.authService.getUid(), params.id).then(
			  		(bookVal: Book) => {
			  			if(bookVal){
			  				this.book = bookVal;
			  			}
			  			else{
			  				this.router.navigate(['books']);
			  			}
			  		}
			  	).catch(
			  		err => console.log('getSingleBook promise err: '+err)
			  	);
		  	}
  		}
  	);
  }

  onDeleteBook(){
  	if(confirm('"'+this.book.title+'"\n\rCe livre sera supprimé de votre bibliothèque. Continuer ?')){
  		this.booksService.removeBook(this.authService.getUid(), this.book);
  		this.router.navigate(['/books']);
  	}
  }

  onBack(){
  	this.router.navigate(['/books'])
  }

}
