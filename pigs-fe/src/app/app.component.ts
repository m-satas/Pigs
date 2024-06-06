import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pigs-fe';

  constructor(private router: Router) {
    this.router.navigateByUrl('/game-board', { skipLocationChange: true});
   }
}
