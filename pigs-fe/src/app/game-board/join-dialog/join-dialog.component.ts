import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServerService } from '../../server.service';
import { ConnectionResponse } from '../game-board.model';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';
import { AboutDialogComponent } from '../about-dialog/about-dialog.component';

@Component({
  selector: 'app-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrl: './join-dialog.component.scss'
})
export class JoinDialogComponent {

  public roomId = '';
  public playerName = '';
  public error = '';

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<JoinDialogComponent>,
    public server: ServerService
  ) {
    this.server.clearData();
  }

  public async joinGame(): Promise<void> {
    const serverResponse = await this.server.joinGame(this.roomId, this.playerName);

    if(serverResponse === ConnectionResponse.Full) {
      this.error = "Room full!";
      return;
    }

    this.dialogRef.close();
  }

  public openRulesDialog(): void {
    this.dialog.open(RulesDialogComponent, { autoFocus: false });
  }

  public openAbouDialog(): void {
    this.dialog.open(AboutDialogComponent, { autoFocus: false });
  }
}
