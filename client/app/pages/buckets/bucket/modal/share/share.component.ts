import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  @Input() show;

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.show = false
  }
}
