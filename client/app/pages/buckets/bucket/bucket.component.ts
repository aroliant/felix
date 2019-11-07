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
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      this.upload(files[i], 0)
    }

  }

  uploadFolders(event) {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      this.upload(files[i], 0)
    }

  }

  upload(file, uploadingIndex) {

    console.log(file)

    const fileLength = file.size;

    let uploadFilePath = ''

    if (file.webkitRelativePath) {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.webkitRelativePath}`
    } else if (file.mozRelativePath) {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.mozRelativePath}`
    } else {
      uploadFilePath = `${this.bucketName}${this.currentPath}${file.name}`
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:3000/bucket/objects/${uploadFilePath}`, true);
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

  openUploadFilesModal() {
    document.getElementById("UploadFilesModal").style.display = "block";
  }
  closeUploadFilesModal() {
    document.getElementById("UploadFilesModal").style.display = "none";
  }

  openUploadFoldersModal() {
    document.getElementById("UploadFoldersModal").style.display = "block";
  }
  closeUploadFoldersModal() {
    document.getElementById("UploadFoldersModal").style.display = "none";
  }


}
