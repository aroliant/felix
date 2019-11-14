import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-move-files',
  templateUrl: './move-files.component.html',
  styleUrls: ['./move-files.component.scss']
})
export class MoveFilesComponent implements OnInit {

  @Input() show: Boolean;
  @Output() onHide = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.show = false
    this.onHide.emit(false)
  }
}
