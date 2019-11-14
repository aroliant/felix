import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

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
