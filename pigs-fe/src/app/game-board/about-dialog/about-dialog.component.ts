import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html'
})
export class AboutDialogComponent {

  public version = environment.version;

  constructor(
    public dialogRef: MatDialogRef<AboutDialogComponent>,
  ) { }
}
