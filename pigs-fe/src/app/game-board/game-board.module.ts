import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

import { GameBoardComponent } from './game-board/game-board.component';
import { GameBoardRoutingModule } from './game-board-routing.module';
import { CardsOnTableComponent } from './cards-on-table/cards-on-table.component';
import { CardComponent } from './card/card.component';
import { PointsScoredComponent } from './points-scored/points-scored.component';
import { PlayerHandComponent } from './player-hand/player-hand.component';
import { PlayerComponent } from './player/player.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { JoinDialogComponent } from './join-dialog/join-dialog.component';
import { PigIconComponent } from './pig-icon/pig-icon.component';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { RulesDialogComponent } from './rules-dialog/rules-dialog.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';

@NgModule({
  declarations: [
    GameBoardComponent,
    CardsOnTableComponent,
    CardComponent,
    PointsScoredComponent,
    PlayerHandComponent,
    PlayerComponent,
    JoinDialogComponent,
    PigIconComponent,
    ScoreDialogComponent,
    RulesDialogComponent,
    AboutDialogComponent
  ],
  imports: [
    CommonModule,
    GameBoardRoutingModule,
    AngularSvgIconModule,
    FormsModule,

    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatMenuModule
  ]
})
export class GameBoardModule { }
