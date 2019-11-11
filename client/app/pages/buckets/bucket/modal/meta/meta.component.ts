import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {

  @Input() show;

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.show = false
  }

}
