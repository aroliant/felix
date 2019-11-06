import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {

  bucketName = 'aroliant'
  currentPath = '/'

  constructor() { }

  ngOnInit() {
  }

  uploadFiles(event) {
    console.log(event.target.files)
    this.upload(event.target.files[0], 0)
  }

  uploadFolders(event) {
    console.log(event.target.files)
  }

  upload(file, uploadingIndex) {

    console.log(file)

    const fileLength = file.size;

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:3000/bucket/objects/${this.bucketName}${this.currentPath}${file.name}`, true);
    xhr.upload.onprogress = function (e) {
      const percentComplete = Math.ceil((e.loaded / e.total) * 100);
      console.log(percentComplete)
    };

    xhr.onload = function () {
      if (this.status === 200) {
        console.log(this.status)
      }
    }

    if (fileLength > 0) {
      xhr.send(formData);
    }
  }


}
