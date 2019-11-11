import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from 'client/app/services/main.service';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {

  bucketName = 'aroliant'
  currentPath = '/'
  searchInput = ''
  bucket: any
  objects = []
  objectStates = []
  states = {
    checkedAll: false,
  }

  constructor(private route: ActivatedRoute, private mainService: MainService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.bucketName = params.bucketName;
      this.mainService.getBucket(this.bucketName).subscribe((res: any) => {
        if (res.success) {
          this.bucket = res.bucket;
        }
      });

      const filters = {
        bucketName: this.bucketName,
        path: this.currentPath
      }
      this.mainService.searchObjects(filters).subscribe((objectsResult: any) => {
        this.objects = objectsResult.objects
        this.objectStates = Array(this.objects.length).fill({
          showActions: false,
          isSelected: false,
        })
      })

    })
  }

  selectAll(state) {
    this.objectStates = Array(this.objects.length).fill({
      showActions: false,
      isSelected: state,
    })
  }

  selectObject(state, index) {
    this.states.checkedAll = false
    this.objectStates[index].isSelected = state
  }

  search() {
    // TODO :     
  }

  deleteObject() {
    // TODO :
  }

  deleteObjects(objects) {
    this.mainService.deleteObjects(objects).subscribe((res: any) => {
      if (res.success) {
        // TODO : Remove from UI
      }
    })
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


  openManagePermissionModal() {
    document.getElementById("ManagePermissionModal").style.display = "block";
  }
  closeManagePermissionModal() {
    document.getElementById("ManagePermissionModal").style.display = "none";
  }

  openManageMetaModal() {
    document.getElementById("ManageMetaModal").style.display = "block";
  }
  closeManageMetaModal() {
    document.getElementById("ManageMetaModal").style.display = "none";
  }

  showManageMeta__custompairing() {
    document.getElementById("ManageMeta__custompairing").style.display = "flex";
  }
  hideManageMeta__custompairing() {
    document.getElementById("ManageMeta__custompairing").style.display = "none";
  }

  openMoveItemModal() {
    document.getElementById("MoveItemModal").style.display = "flex";
  }
  closeMoveItemModal() {
    document.getElementById("MoveItemModal").style.display = "none";
  }

  openShareItemModal() {
    document.getElementById("ShareItemModal").style.display = "flex";
  }
  closeShareItemModal() {
    document.getElementById("ShareItemModal").style.display = "none";
  }

}
