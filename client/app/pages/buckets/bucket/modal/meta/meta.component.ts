import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {

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
