import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

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
