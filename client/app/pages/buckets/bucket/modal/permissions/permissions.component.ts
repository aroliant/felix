import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  @Input() show;

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.show = false
  }

}
