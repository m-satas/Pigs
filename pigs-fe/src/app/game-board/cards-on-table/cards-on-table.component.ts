import { Component } from '@angular/core';
import { ServerService } from '../../server.service';

import { Card, Phase } from '../game-board.model';

@Component({
  selector: 'app-cards-on-table',
  templateUrl: './cards-on-table.component.html',
  styleUrl: './cards-on-table.component.scss'
})
export class CardsOnTableComponent {

  public takeRowPhase = Phase.Take;

  constructor (
    public server: ServerService
  ) { }

  public takeRow(rowIndex: number): void {
    this.server.takeRow(rowIndex);
  }

  public getCardHighlightColor(number: number): string {
    const player = this.server.gameState.playerStates.find(player => player.lastCardPlayed && player.lastCardPlayed.number === number);
    if (!player) { return ''; }

    return this.server.playerColors.get(player.id) || '';

  }
}
