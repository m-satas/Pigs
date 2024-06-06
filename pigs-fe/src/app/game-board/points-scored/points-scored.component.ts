import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-points-scored',
  templateUrl: './points-scored.component.html',
  styleUrl: './points-scored.component.scss'
})
export class PointsScoredComponent {

  @Input() poopInPile: number = 0;

}
