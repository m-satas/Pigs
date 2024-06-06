import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ServerService } from "../../server.service";
import { GameState, Phase } from "../game-board.model";

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrl: './score-dialog.component.scss'
})
export class ScoreDialogComponent implements OnInit {

  public scores: { id: string, name: string, score: number}[] = [];

  constructor(
    public dialogRef: MatDialogRef<ScoreDialogComponent>,
    public server: ServerService
  ) {}

  ngOnInit(): void {
    for (let player of this.server.gameState.playerStates) {
      this.scores.push({
        id: player.id,
        name: player.name,
        score: player.points
      });
    }

    this.scores.sort((a, b) => a.score - b.score);
    this.server.winningPlayerId = this.scores[0].id;

    this.server.listenForGameState().subscribe((gameState: GameState) => {
      if (gameState.gamePhase === Phase.Choosing) {
        this.dialogRef.close(true);
      }
    });
  }

  public continue() {
    this.server.startGame(false);
  }

  public newSeries() {
    this.server.startGame(true);
  }

  public leave() {
    this.server.leaveGame();
    this.dialogRef.close(false);
  }
}