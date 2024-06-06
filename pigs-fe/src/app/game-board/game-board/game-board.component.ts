import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { MatDialog } from '@angular/material/dialog';
import { JoinDialogComponent } from '../join-dialog/join-dialog.component';
import { GameState, Phase, Player } from '../game-board.model';
import { ScoreDialogComponent } from '../score-dialog/score-dialog.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {

  public Phase = Phase;

  constructor (
    public server: ServerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.openJoinDialog();

    this.server.listenForGameEnd().subscribe(() => {
      this.openScoreDialog();
    });
  }

  public openJoinDialog() {
    this.dialog.open(JoinDialogComponent, {
      disableClose: true
    });
  }

  public openScoreDialog() {
    this.dialog.open(ScoreDialogComponent, {
      disableClose: true
    }).afterClosed().subscribe(res => {
      if (!res) { this.openJoinDialog(); }
    });
  }

  public startGame(clearScores: boolean) {
    this.server.startGame(clearScores);
  }

}
