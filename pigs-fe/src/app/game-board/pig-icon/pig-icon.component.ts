import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-pig-icon',
  templateUrl: './pig-icon.component.html'
})
export class PigIconComponent {

  @Input() mainColor: string = '#ffa7b9'
  @Input() singleColor: string = '';
  @Input() stroke: boolean = true;
  @Input() crown: boolean = false;

}