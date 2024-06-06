import { Component, Input } from '@angular/core';
import { Card, Phase, Player } from '../game-board.model';
import { ServerService } from '../../server.service';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrl: './player-hand.component.scss'
})
export class PlayerHandComponent {

  public selectedCardIndex: number = -1;

  constructor (
    public server: ServerService
  ) { }

  public selectCard(card: Card, index: number) {

    if (this.server.gameState.gamePhase !== Phase.Choosing) {
      return;
    }

    if (index === this.selectedCardIndex && this.server.player.chosenCard) {
      this.selectedCardIndex = -1;
      this.server.deselectCard();
      return;
    }

    this.selectedCardIndex = index;
    this.server.selectCard(card);
  }

  public calcCardHeightOffset(index: number): number {
    const distanceFromCenter = Math.abs(index - (this.server.player.cardsInHand.length - 1) / 2);
    return 0.1 * Math.pow(distanceFromCenter, 3.1) + 50;
  }

  public calcCardRotation(index: number): number {
    return (index - (this.server.player.cardsInHand.length - 1) / 2) * 2;
  }

  // Margin needs to be adjusted in a non-linear fashion depending on how many cards are left in hand.
  // y = 0.8x^2 - 16x - 20
  public clacCardMargin(): number {
    return 0.8 * Math.pow(this.server.player.cardsInHand.length, 2) - 16 * this.server.player.cardsInHand.length + 20;
  }
}