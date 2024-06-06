import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameBoardComponent } from './game-board/game-board.component';

const routes: Routes = [
  { path: 'game-board', component: GameBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameBoardRoutingModule { }