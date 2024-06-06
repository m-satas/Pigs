import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameBoardModule } from './game-board/game-board.module';

const routes: Routes = [
  // { path: '', redirectTo: 'game-board', pathMatch: 'full'},
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes),
      GameBoardModule,
    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
