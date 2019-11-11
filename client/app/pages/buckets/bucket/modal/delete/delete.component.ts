import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  @Input() show;

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.show = false
  }

}
