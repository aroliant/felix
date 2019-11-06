import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  uploadFiles(event) {
    console.log(event.target.files)
  }

  uploadFolders(event) {
    console.log(event.target.files)
  }


}
