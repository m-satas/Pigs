import { Component, Input, OnInit } from '@angular/core';
import { CARD_COLORS } from '../cardColors';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {

  @Input() number: number = 0;
  @Input()
  set numberOfPoints(number: number) {
    this.pointsArray = Array(number);
  }
  @Input() highlightColor: string = '';

  public pointsArray: number[] = [];
  public backgroundColor: string = '';
  public iconColor: string = '#24e612';

  ngOnInit(): void {
    this.assignColors();
  }

  private assignColors() {
    const colors = CARD_COLORS[this.pointsArray.length];
    if (colors) {
      this.iconColor = colors.iconColor;
      this.backgroundColor = colors.backgroundColor;
    }
  }
}
