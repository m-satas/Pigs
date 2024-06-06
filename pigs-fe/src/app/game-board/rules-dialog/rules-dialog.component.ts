import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rules-dialog',
  templateUrl: './rules-dialog.component.html'
})
export class RulesDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<RulesDialogComponent>,
    ) { }
}
