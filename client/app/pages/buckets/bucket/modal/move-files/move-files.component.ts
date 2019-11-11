import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-move-files',
  templateUrl: './move-files.component.html',
  styleUrls: ['./move-files.component.scss']
})
export class MoveFilesComponent implements OnInit {

  @Input() show;

  constructor() { }

  ngOnInit() {
  }

}
