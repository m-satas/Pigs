import { Component, Input } from '@angular/core';
import { Player, PlayerState } from '../game-board.model';
import { MatDialog } from '@angular/material/dialog';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';
import { ServerService } from '../../server.service';
import { JoinDialogComponent } from '../join-dialog/join-dialog.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  @Input() playerState: PlayerState | Player = new PlayerState;
  @Input() color: string = '#efc849';
  @Input() crown: boolean = false;
  @Input() optionBurger: boolean = false;

  constructor(
    public dialog: MatDialog,
    public server: ServerService
  ) {}

  public openRulesDialog(): void {
    this.dialog.open(RulesDialogComponent, { autoFocus: false });
  }

  public leave() {
    this.server.leaveGame();
    this.dialog.open(JoinDialogComponent, {
      disableClose: true
    });
  }
}
