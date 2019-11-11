import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

  @Input() show;

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.show = false
  }

}
